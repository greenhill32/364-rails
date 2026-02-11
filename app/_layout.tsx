// -----------------------------
// /app/_layout.tsx
// Root layout: Stack navigation for app flow
// -----------------------------
import { Stack } from 'expo-router';
import { EntitlementProvider } from '@/contexts/EntitlementContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import * as Sentry from '@sentry/react-native';

// Initialize Sentry for crash reporting
const sentryDSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
const isSentryEnabled = !!sentryDSN;

if (isSentryEnabled) {
  Sentry.init({
    dsn: sentryDSN,
    enableAutoPerformanceTracing: true,
  });
}

function RootLayoutContent() {
  return (
    <EntitlementProvider>
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#4a1942' }, // Plum background
            animation: 'fade',
          }}
        >
      <Stack.Screen
        name="index"
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="pick-golden-day"
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="calendar"
        options={{
          animation: 'slide_from_right',
        }}
      />
      </Stack>
      </FavoritesProvider>
    </EntitlementProvider>
  );
}

// Only wrap with Sentry if initialized, otherwise export directly
export default isSentryEnabled ? Sentry.wrap(RootLayoutContent) : RootLayoutContent;