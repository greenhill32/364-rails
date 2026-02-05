import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';

const STORAGE_KEYS = {
  REMAINING_TAPS: '@364_remainingTaps',
  TAPPED_DAYS: '@364_tappedDays',
  GOLDEN_DAY: '@364_goldenDay',
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
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
  decrementTap: () => Promise<void>;
  addTappedDay: (dateKey: string) => Promise<void>;
  setGoldenDay: (month: number, date: number) => Promise<void>;
};

const EntitlementContext = createContext<EntitlementState>({
  isPro: false,
  isLoading: true,
  remainingTaps: 3,
  tappedDays: new Set(),
  goldenDay: null,
  purchase: async () => {},
  restore: async () => {},
  decrementTap: async () => {},
  addTappedDay: async () => {},
  setGoldenDay: async () => {},
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
      const [storedTaps, storedDays, storedGolden] = await Promise.all([
        storage.getItem(STORAGE_KEYS.REMAINING_TAPS),
        storage.getItem(STORAGE_KEYS.TAPPED_DAYS),
        storage.getItem(STORAGE_KEYS.GOLDEN_DAY),
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

  const value: EntitlementState = {
    isPro,
    isLoading,
    remainingTaps,
    tappedDays,
    goldenDay,
    purchase,
    restore,
    decrementTap,
    addTappedDay,
    setGoldenDay,
  };

  return (
    <EntitlementContext.Provider value={value}>
      {children}
    </EntitlementContext.Provider>
  );
}
