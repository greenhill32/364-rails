// -----------------------------
// /components/SettingsModal.tsx
// Settings Modal: Privacy, TOS, Restore Purchases
// -----------------------------
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, Linking } from 'react-native';
import { useState } from 'react';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useEntitlement } from '@/contexts/EntitlementContext';

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { restore, isPro } = useEntitlement();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      await restore();
      alert('Purchases restored successfully!');
    } catch (error) {
      alert('No purchases found to restore.');
    } finally {
      setIsRestoring(false);
    }
  };
  const handlePrivacyPolicy = async () => {
    await Linking.openURL('https://publicbucket3222.blob.core.windows.net/$web/364/privacy.html');
  };

  const handleTermsOfService = async () => {
    await Linking.openURL('https://publicbucket3222.blob.core.windows.net/$web/364/terms.html');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Close settings"
          >
            <View pointerEvents="none">
              <X size={24} color={Colors.gold} />
            </View>
          </Pressable>

          {/* Title */}
          <Text style={styles.title}>Settings</Text>

          {/* Restore Purchases */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleRestore}
            disabled={isRestoring}
            accessibilityRole="button"
            accessibilityLabel="Restore purchases"
          >
            <Text style={styles.menuItemText}>
              {isRestoring ? 'Restoring...' : 'Restore Purchases'}
            </Text>
            <Text style={styles.menuItemChevron}>›</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePrivacyPolicy}
            accessibilityRole="button"
            accessibilityLabel="Privacy Policy"
          >
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text style={styles.menuItemChevron}>›</Text>
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleTermsOfService}
            accessibilityRole="button"
            accessibilityLabel="Terms of Service"
          >
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Text style={styles.menuItemChevron}>›</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
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
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 12,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.gold,
    marginBottom: 24,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.cream,
  },
  menuItemChevron: {
    fontSize: 24,
    color: Colors.gold,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    fontSize: 12,
    color: Colors.cream,
    opacity: 0.5,
  },
});
