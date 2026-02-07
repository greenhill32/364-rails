// -----------------------------
// /components/AmoreModal.tsx
// Amore Modal: Golden day special screen
// -----------------------------
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';

type AmoreModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function AmoreModal({ visible, onClose }: AmoreModalProps) {
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
            accessibilityLabel="Close"
          >
            <View pointerEvents="none">
              <X size={28} color={Colors.gold} />
            </View>
          </Pressable>

          {/* Wink GIF */}
          <Image
            source={require('../assets/images/wink.gif')}
            style={styles.winkGif}
            resizeMode="cover"
          />

          {/* Top Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <View style={styles.sparkle} />
            <View style={styles.line} />
          </View>

          {/* Amore Title */}
          <Text style={styles.amoreTitle}>Amore</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Today is for love, not excuses
          </Text>

          {/* Bottom Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <View style={styles.sparkle} />
            <View style={styles.line} />
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={onClose}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.doneButtonText}>Perfect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContainer: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 24,
    padding: 60,
    width: '100%',
    maxWidth: 380,
    borderWidth: 2,
    borderColor: Colors.gold,
    position: 'relative',
    alignItems: 'center',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 12,
    zIndex: 10,
  },
  winkGif: {
    width: '100%',
    height: 380,
    marginBottom: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  line: {
    width: 50,
    height: 1,
    backgroundColor: Colors.gold,
    opacity: 0.6,
  },
  sparkle: {
    width: 12,
    height: 12,
    backgroundColor: Colors.gold,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 16,
  },
  amoreTitle: {
    fontSize: 48,
    fontWeight: '300',
    color: Colors.gold,
    fontStyle: 'italic',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'Didot',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.cream,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 8,
    fontStyle: 'italic',
  },
  doneButton: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.backgroundDark,
    letterSpacing: 2,
  },
});