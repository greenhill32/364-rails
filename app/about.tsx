import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';



export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.replace('/pick-golden-day');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.topContent}>
          <View style={styles.header}>
            <View style={styles.decorativeLine} />
            <Text style={styles.title}>364</Text>
            <Text style={styles.subtitle}>WAYS TO SAY NO</Text>
            <View style={styles.decorativeLine} />
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              For every day of the year except one, we provide you with the perfect excuse.
            </Text>
            <Text style={styles.description}>
              Because sometimes &quot;no&quot; needs a little creativity.
            </Text>
          </View>

          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Calendar size={24} color={Colors.gold} />
              </View>
              <Text style={styles.featureText}>Tap any day for inspiration</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.sparkleIcon}>
                <View style={styles.miniSparkle} />
              </View>
              <Text style={styles.featureText}>3 free excuses to start</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.infinitySymbol}>∞</Text>
              </View>
              <Text style={styles.featureText}>Unlock all 364 with one purchase</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Begin</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Elegantly decline, almost every time.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  topContent: {
    flex: 1,
  },
  bottomContent: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  decorativeLine: {
    width: 60,
    height: 1,
    backgroundColor: Colors.gold,
    opacity: 0.5,
    marginVertical: 8,
  },
  title: {
    fontSize: 72,
    fontWeight: '300',
    color: Colors.gold,
    fontStyle: 'italic',
    letterSpacing: -1,
    fontFamily: 'Didot',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.gold,
    letterSpacing: 6,
    marginTop: -5,
    fontFamily: 'Didot',
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: Colors.cream,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
    opacity: 0.9,
  },
  featureContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sparkleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  miniSparkle: {
    width: 10,
    height: 10,
    backgroundColor: Colors.gold,
    transform: [{ rotate: '45deg' }],
  },
  infinitySymbol: {
    fontSize: 24,
    color: Colors.gold,
    fontWeight: '300',
  },
  featureText: {
    fontSize: 15,
    color: Colors.cream,
    flex: 1,
  },
  continueButton: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.backgroundDark,
    letterSpacing: 2,
  },
  footerText: {
    fontSize: 13,
    color: Colors.gold,
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});