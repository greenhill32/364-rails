// -----------------------------
// /app/calendar.tsx
// Calendar Screen: Monthly view with golden day
// -----------------------------
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useEntitlement } from '@/contexts/EntitlementContext';
import { QUOTES_364 } from '@/constants/quotes';
import { QuoteModal } from '../components/QuoteModal';
import { AmoreModal } from '../components/AmoreModal';
import { LockModal } from '../components/LockModal';
import { SettingsModal } from '../components/SettingsModal';
import { PrematureModal } from '../components/PrematureModal';

const { width } = Dimensions.get('window');
const DAY_SIZE = (width - 60) / 7;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { isPro, remainingTaps, tappedDays, goldenDay, decrementTap, addTappedDay, getNextQuote } = useEntitlement();

  const goldenDayMonth = goldenDay?.month ?? -1;
  const goldenDayDate = goldenDay?.date ?? -1;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<string | null>(null);
  const [showAmoreModal, setShowAmoreModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPrematureModal, setShowPrematureModal] = useState(false);
  const [freeQuoteIndex, setFreeQuoteIndex] = useState(0);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayPress = async (day: number) => {
    const isGoldenDay =
      currentMonth === goldenDayMonth &&
      day === goldenDayDate;

    // Check paywall: golden day requires pro, regular days need taps
    if (isGoldenDay && !isPro) {
      setShowLockModal(true);
      return;
    }

    if (!isPro && remainingTaps === 0) {
      setShowLockModal(true);
      return;
    }

    if (isGoldenDay) {
      // Check if premature (less than 5 taps)
      if (tappedDays.size < 5) {
        setShowPrematureModal(true);
      } else {
        setShowAmoreModal(true);
      }
      return;
    }

    // User has taps - show quote and track
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const { quote, newIndex } = getNextQuote(isPro, freeQuoteIndex);
    if (newIndex !== undefined) {
      setFreeQuoteIndex(newIndex);
    }

    setCurrentQuote(quote);
    setShowQuoteModal(true);
    await decrementTap();
    await addTappedDay(dateKey);
  };

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const handleChangeLuckyDay = () => {
    router.push('/pick-golden-day');
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setCurrentQuote(null);
  };

  const closeAmoreModal = () => {
    setShowAmoreModal(false);
  };

  const handleContinueToGolden = () => {
    setShowPrematureModal(false);
    setShowAmoreModal(true);
  };

  const handleBackToCalendar = () => {
    setShowPrematureModal(false);
  };

  const handlePurchase = () => {
    // TODO: Stage 5 - Actual IAP purchase logic
    console.log('Purchase initiated');
    setShowLockModal(false);
    // For now, just close the modal
    // In Stage 5, this will trigger RevenueCat purchase
  };

  const handleMaybeLater = () => {
    setShowLockModal(false);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: React.ReactElement[] = [];

    // Empty cells before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === new Date().getDate() && 
        currentMonth === new Date().getMonth() && 
        currentYear === new Date().getFullYear();

      const isGoldenDay = 
        currentMonth === goldenDayMonth && 
        day === goldenDayDate;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && !isGoldenDay && styles.todayCell,
            isGoldenDay && styles.goldDayCell,
          ]}
          onPress={() => handleDayPress(day)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.dayText,
            isToday && !isGoldenDay && styles.todayText,
            isGoldenDay && styles.goldDayText,
          ]}>
            {day}
          </Text>
          {isGoldenDay && <View style={styles.goldIndicator} />}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* Settings Button */}
        <View style={styles.settingsRow}>
          <Pressable
            style={styles.settingsButton}
            onPress={handleSettingsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View pointerEvents="none">
              <Settings size={24} color={Colors.gold} />
            </View>
          </Pressable>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>364</Text>
          <Text style={styles.headerSubtitle}>WAYS TO SAY NO</Text>
          <Text style={styles.dayCounter}>{tappedDays.size}/364</Text>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <Text style={styles.monthText}>
            {MONTHS[currentMonth]} {currentYear}
          </Text>
          
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Weekday Headers */}
        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map((day, index) => (
            <View key={index} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <ScrollView 
          style={styles.calendarScroll}
          contentContainerStyle={styles.calendarGrid}
          showsVerticalScrollIndicator={false}
        >
          {renderCalendarDays()}
        </ScrollView>

        {/* Free Taps Counter */}
        {!isPro && (
          <View style={styles.tapCounter}>
            <Text style={styles.tapCounterText}>
              {remainingTaps} free {remainingTaps === 1 ? 'tap' : 'taps'} remaining
            </Text>
          </View>
        )}

        {/* Change Lucky Day Button */}
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleChangeLuckyDay}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Change Lucky Day</Text>
        </TouchableOpacity>
      </View>

      {/* Quote Modal */}
      <QuoteModal
        visible={showQuoteModal}
        quote={currentQuote}
        onClose={closeQuoteModal}
      />

      {/* Amore Modal */}
      <AmoreModal
        visible={showAmoreModal}
        onClose={closeAmoreModal}
      />

      {/* Lock Modal */}
      <LockModal
        visible={showLockModal}
        onPurchase={handlePurchase}
        onLater={handleMaybeLater}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettingsModal}
        onClose={closeSettingsModal}
      />

      {/* Premature Modal */}
      <PrematureModal
        visible={showPrematureModal}
        onContinueToGolden={handleContinueToGolden}
        onBackToCalendar={handleBackToCalendar}
      />
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
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: '300',
    color: Colors.gold,
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.gold,
    letterSpacing: 4,
    marginTop: -5,
  },
  dayCounter: {
    fontSize: 11,
    color: Colors.gold,
    opacity: 0.5,
    marginTop: 8,
    letterSpacing: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 32,
    color: Colors.gold,
    fontWeight: '300',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.cream,
    letterSpacing: 0.5,
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    width: DAY_SIZE,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '500',
    opacity: 0.7,
  },
  calendarScroll: {
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCell: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: DAY_SIZE / 2,
  },
  goldDayCell: {
    backgroundColor: Colors.gold,
    borderRadius: DAY_SIZE / 2,
  },
  dayText: {
    fontSize: 16,
    color: Colors.cream,
  },
  todayText: {
    color: Colors.gold,
    fontWeight: '600',
  },
  goldDayText: {
    color: Colors.backgroundDark,
    fontWeight: '700',
  },
  goldIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.backgroundDark,
  },
  tapCounter: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  tapCounterText: {
    fontSize: 14,
    color: Colors.gold,
    opacity: 0.8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  resetButtonText: {
    fontSize: 14,
    color: Colors.gold,
    opacity: 0.8,
  },
});
