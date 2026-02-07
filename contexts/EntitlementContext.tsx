import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';
import { QUOTES_364 } from '@/constants/quotes';

const STORAGE_KEYS = {
  REMAINING_TAPS: '@364_remainingTaps',
  TAPPED_DAYS: '@364_tappedDays',
  GOLDEN_DAY: '@364_goldenDay',
  USED_QUOTE_INDICES: '@364_usedQuoteIndices',
};

// Graceful storage wrapper — uses SecureStore when available, falls back to in-memory
let SecureStore: typeof import('expo-secure-store') | null = null;
try {
  SecureStore = require('expo-secure-store');
} catch {
  console.warn('SecureStore not available — using in-memory storage');
}

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return SecureStore ? await SecureStore.getItemAsync(key) : null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (SecureStore) await SecureStore.setItemAsync(key, value);
    } catch {
      // Silently fail — in-memory state still works
    }
  },
};

type GoldenDay = { month: number; date: number } | null;

type EntitlementState = {
  isPro: boolean;
  isLoading: boolean;
  remainingTaps: number;
  tappedDays: Set<string>;
  goldenDay: GoldenDay;
  usedQuoteIndices: Set<number>;
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
  decrementTap: () => Promise<void>;
  addTappedDay: (dateKey: string) => Promise<void>;
  setGoldenDay: (month: number, date: number) => Promise<void>;
  devTogglePro: () => void;
  getNextQuote: (isPro: boolean, freeQuoteIndex: number) => { quote: string; newIndex?: number };
};

const EntitlementContext = createContext<EntitlementState>({
  isPro: false,
  isLoading: true,
  remainingTaps: 3,
  tappedDays: new Set(),
  goldenDay: null,
  usedQuoteIndices: new Set(),
  purchase: async () => {},
  restore: async () => {},
  decrementTap: async () => {},
  addTappedDay: async () => {},
  setGoldenDay: async () => {},
  devTogglePro: () => {},
  getNextQuote: () => ({ quote: '' }),
});

export function useEntitlement() {
  return useContext(EntitlementContext);
}

type Props = {
  children: ReactNode;
};

export function EntitlementProvider({ children }: Props) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTaps, setRemainingTaps] = useState(3);
  const [tappedDays, setTappedDays] = useState<Set<string>>(new Set());
  const [goldenDay, setGoldenDayState] = useState<GoldenDay>(null);
  const [usedQuoteIndices, setUsedQuoteIndices] = useState<Set<number>>(new Set());

  // Load persisted state and configure RevenueCat on mount
  useEffect(() => {
    const init = async () => {
      await loadPersistedState();
      const apiKey = Constants.expoConfig?.extra?.revenueCatApiKey;
      if (apiKey) {
        await Purchases.configure({ apiKey });
      } else {
        console.error('RevenueCat API key not found in config');
      }
      await checkEntitlement();
    };
    init();
  }, []);

  const loadPersistedState = async () => {
    try {
      const [storedTaps, storedDays, storedGolden, storedUsedQuotes] = await Promise.all([
        storage.getItem(STORAGE_KEYS.REMAINING_TAPS),
        storage.getItem(STORAGE_KEYS.TAPPED_DAYS),
        storage.getItem(STORAGE_KEYS.GOLDEN_DAY),
        storage.getItem(STORAGE_KEYS.USED_QUOTE_INDICES),
      ]);

      if (storedTaps !== null) {
        setRemainingTaps(JSON.parse(storedTaps));
      }

      if (storedDays !== null) {
        setTappedDays(new Set(JSON.parse(storedDays)));
      }

      if (storedGolden !== null) {
        setGoldenDayState(JSON.parse(storedGolden));
      }

      if (storedUsedQuotes !== null) {
        setUsedQuoteIndices(new Set(JSON.parse(storedUsedQuotes)));
      }
    } catch (error) {
      console.error('Failed to load persisted state:', error);
    }
  };

  const checkEntitlement = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasPro = customerInfo.entitlements.active['pro'] !== undefined;
      setIsPro(hasPro);

      if (hasPro) {
        setRemainingTaps(Infinity);
      }
    } catch (error) {
      console.error('Failed to check entitlement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const decrementTap = async () => {
    if (isPro) return;
    const newTaps = Math.max(0, remainingTaps - 1);
    setRemainingTaps(newTaps);
    await storage.setItem(STORAGE_KEYS.REMAINING_TAPS, JSON.stringify(newTaps));
  };

  const addTappedDay = async (dateKey: string) => {
    const updated = new Set(tappedDays);
    updated.add(dateKey);
    setTappedDays(updated);
    await storage.setItem(STORAGE_KEYS.TAPPED_DAYS, JSON.stringify([...updated]));
  };

  const setGoldenDay = async (month: number, date: number) => {
    const value = { month, date };
    setGoldenDayState(value);
    await storage.setItem(STORAGE_KEYS.GOLDEN_DAY, JSON.stringify(value));
  };

  const purchase = async () => {
    try {
      setIsLoading(true);
      const offerings = await Purchases.getOfferings();

      if (offerings.current?.availablePackages.length === 0) {
        throw new Error('No products available');
      }

      const purchasePackage = offerings.current?.availablePackages[0];
      if (!purchasePackage) {
        throw new Error('No package found');
      }

      const { customerInfo } = await Purchases.purchasePackage(purchasePackage);
      const hasPro = customerInfo.entitlements.active['pro'] !== undefined;
      setIsPro(hasPro);

      if (hasPro) {
        setRemainingTaps(Infinity);
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Purchase failed:', error);
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const restore = async () => {
    try {
      setIsLoading(true);
      const customerInfo = await Purchases.restorePurchases();
      const hasPro = customerInfo.entitlements.active['pro'] !== undefined;
      setIsPro(hasPro);

      if (hasPro) {
        setRemainingTaps(Infinity);
      }
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const devTogglePro = () => {
    setIsPro(!isPro);
    if (!isPro) {
      setRemainingTaps(Infinity);
    } else {
      setRemainingTaps(3);
    }
  };

  const getNextQuote = (isPro: boolean, freeQuoteIndex: number): { quote: string; newIndex?: number } => {
    if (!isPro) {
      // Free users cycle through 3 free quotes
      const quote = QUOTES_364.free[freeQuoteIndex];
      const newIndex = (freeQuoteIndex + 1) % QUOTES_364.free.length;
      return { quote, newIndex };
    }

    // Pro users: get random quote from unused ones
    const unlockedQuotes = QUOTES_364.unlocked;
    const availableIndices: number[] = [];

    for (let i = 0; i < unlockedQuotes.length; i++) {
      if (!usedQuoteIndices.has(i)) {
        availableIndices.push(i);
      }
    }

    // If all quotes used, reset
    if (availableIndices.length === 0) {
      setUsedQuoteIndices(new Set());
      availableIndices.push(...Array.from({ length: unlockedQuotes.length }, (_, i) => i));
    }

    // Pick random from available
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const newUsedIndices = new Set(usedQuoteIndices);
    newUsedIndices.add(randomIndex);
    setUsedQuoteIndices(newUsedIndices);

    // Persist
    storage.setItem(STORAGE_KEYS.USED_QUOTE_INDICES, JSON.stringify([...newUsedIndices]));

    return { quote: unlockedQuotes[randomIndex] };
  };

  const value: EntitlementState = {
    isPro,
    isLoading,
    remainingTaps,
    tappedDays,
    goldenDay,
    usedQuoteIndices,
    purchase,
    restore,
    decrementTap,
    addTappedDay,
    setGoldenDay,
    devTogglePro,
    getNextQuote,
  };

  return (
    <EntitlementContext.Provider value={value}>
      {children}
    </EntitlementContext.Provider>
  );
}
