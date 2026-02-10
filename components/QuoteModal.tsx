// -----------------------------
// /components/QuoteModal.tsx
// Quote Modal: Display witty rejection with share & favorite options
// -----------------------------
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, Share, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { Quote } from '@/constants/quotes';
import Colors from '@/constants/colors';
import { FavoriteHeartButton } from './FavoriteHeartButton';

type QuoteModalProps = {
  visible: boolean;
  quote: Quote | null;
  onClose: () => void;
};

export function QuoteModal({ visible, quote, onClose }: QuoteModalProps) {
  const handleShare = async () => {
    if (!quote) return;

    try {
      await Share.share({
        message: `"${quote.text}"\n\n— 364 Ways to Say No`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (!quote) return null;

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
              <X size={24} color={Colors.gold} />
            </View>
          </Pressable>

          {/* Top Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <View style={styles.diamond} />
            <View style={styles.line} />
          </View>

          {/* Quote Text */}
          <Text style={styles.quoteText}>"{quote.text}"</Text>

          {/* Bottom Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <View style={styles.diamond} />
            <View style={styles.line} />
          </View>

          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Share quote"
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          {/* Noted Button */}
          <TouchableOpacity
            style={styles.notedButton}
            onPress={onClose}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
          >
            <Text style={styles.notedButtonText}>Noted</Text>
          </TouchableOpacity>

          {/* Heart Button */}
          <View style={styles.heartRow}>
            <FavoriteHeartButton quote={quote} />
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
    backgroundColor: Colors.backgroundDark,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 14,
    zIndex: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: Colors.gold,
    opacity: 0.5,
  },
  diamond: {
    width: 8,
    height: 8,
    backgroundColor: Colors.gold,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 12,
  },
  quoteText: {
    fontSize: 18,
    color: Colors.cream,
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
  shareButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.gold,
    letterSpacing: 1,
  },
  notedButton: {
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 16,
  },
  heartRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  notedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.backgroundDark,
    letterSpacing: 1,
  },
});