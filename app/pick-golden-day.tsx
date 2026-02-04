// -----------------------------
// /app/pick-golden-day.tsx
// Pick Golden Day: iOS calendar date picker
// -----------------------------
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import Colors from '@/constants/colors';

export default function PickGoldenDayScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleContinue = () => {
    // TODO: Save selected date to storage (Stage 5)
    // For now, just navigate to calendar
    router.replace('/calendar');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.header}>
          <View style={styles.decorativeLine} />
          <Text style={styles.title}>Choose Your</Text>
          <Text style={styles.subtitle}>GOLDEN DAY</Text>
          <View style={styles.decorativeLine} />
        </View>

        <Text style={styles.description}>
          Pick one special day of the year{'\n'}
          for amore instead of excuses.
        </Text>

        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="inline"
            onChange={(event, date) => {
              if (date) setSelectedDate(date);
            }}
            textColor={Colors.gold}
            accentColor={Colors.gold}
            themeVariant="dark"
            style={styles.picker}
          />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          You can change this later.
        </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
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
    fontSize: 32,
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
    letterSpacing: 4,
    marginTop: -5,
    fontFamily: 'Didot',
  },
  description: {
    fontSize: 16,
    color: Colors.cream,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    opacity: 0.9,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  picker: {
    width: '100%',
    height: 350,
  },
  continueButton: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 20,
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
    marginTop: 16,
  },
});