// -----------------------------
// /components/PrematureModal.tsx
// Premature Golden Day Screen: Playful interstitial
// -----------------------------
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';

type PrematureModalProps = {
  visible: boolean;
  onContinueToGolden: () => void;
  onBackToCalendar: () => void;
};

export function PrematureModal({ visible, onContinueToGolden, onBackToCalendar }: PrematureModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onBackToCalendar}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <Pressable
            style={styles.closeButton}
            onPress={onBackToCalendar}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <View pointerEvents="none">
              <X size={24} color={Colors.gold} />
            </View>
          </Pressable>

          {/* Premature GIF */}
          <Image
            source={require('../assets/images/prem.jpg')}
            style={styles.gifImage}
            resizeMode="cover"
          />

          {/* Title */}
          <Text style={styles.title}>A Bit Premature...</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            You've only revealed a few excuses so far. Are you sure today is the day for love?
          </Text>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onContinueToGolden}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue to golden day"
          >
            <Text style={styles.primaryButtonText}>Yes, It's Amore Time</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onBackToCalendar}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back to calendar"
          >
            <Text style={styles.secondaryButtonText}>Maybe Tomorrow</Text>
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
    padding: 20,
    width: '95%',
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
  gifImage: {
    width: '100%',
    height: 240,
    marginBottom: 20,
    marginTop: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: Colors.gold,
    fontStyle: 'italic',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Didot',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.cream,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.9,
  },
  primaryButton: {
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 12,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.backgroundDark,
    letterSpacing: 1,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.gold,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
