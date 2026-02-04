import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';

type EntitlementState = {
  isPro: boolean;
  isLoading: boolean;
  remainingTaps: number;
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
};

const EntitlementContext = createContext<EntitlementState>({
  isPro: false,
  isLoading: true,
  remainingTaps: 3,
  purchase: async () => {},
  restore: async () => {},
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

  // Check entitlement status on mount
  useEffect(() => {
    checkEntitlement();
  }, []);

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
    purchase,
    restore,
  };

  return (
    <EntitlementContext.Provider value={value}>
      {children}
    </EntitlementContext.Provider>
  );
}
