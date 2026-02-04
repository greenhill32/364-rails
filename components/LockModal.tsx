// -----------------------------
// /components/LockModal.tsx
// Lock Modal: Paywall when free taps expire
// -----------------------------
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useEntitlement } from '@/contexts/EntitlementContext';

type LockModalProps = {
  visible: boolean;
  onPurchase: () => void;
  onLater: () => void;
};

export function LockModal({ visible, onPurchase, onLater }: LockModalProps) {
  const { purchase } = useEntitlement();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      await purchase();
      onPurchase();
    } catch (error) {
      alert('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onLater}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Lock Icon */}
          <View style={styles.lockIconContainer}>
            <Lock size={48} color={Colors.gold} strokeWidth={1.5} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Unlock All 364 Excuses</Text>

          {/* Description */}
          <Text style={styles.description}>
            You've used your free taps.{'\n\n'}
            Get unlimited access to all 364 witty ways to say no for just $2.99.
          </Text>

          {/* Features List */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>✓</Text>
              <Text style={styles.featureText}>364 unique excuses</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>✓</Text>
              <Text style={styles.featureText}>Unlimited access forever</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>✓</Text>
              <Text style={styles.featureText}>One-time purchase, no subscription</Text>
            </View>
          </View>

          {/* Purchase Button */}
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePurchase}
            disabled={isPurchasing}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Unlock for $2.99"
          >
            <Text style={styles.purchaseButtonText}>
              {isPurchasing ? 'Processing...' : 'Unlock for $2.99'}
            </Text>
          </TouchableOpacity>

          {/* Maybe Later Button */}
          <TouchableOpacity
            style={styles.laterButton}
            onPress={onLater}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Maybe later"
          >
            <Text style={styles.laterButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.background,  // Solid purple (was Colors.backgroundDark)
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lockIconContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.gold,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.cream,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    marginBottom: 24,
  },
  features: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 16,
    color: Colors.gold,
    marginRight: 12,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    color: Colors.cream,
    opacity: 0.9,
  },
  purchaseButton: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    marginBottom: 12,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.backgroundDark,
    textAlign: 'center',
    letterSpacing: 1,
  },
  laterButton: {
    paddingVertical: 12,
  },
  laterButtonText: {
    fontSize: 14,
    color: Colors.cream,
    opacity: 0.7,
    textAlign: 'center',
  },
});