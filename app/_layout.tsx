// -----------------------------
// /app/_layout.tsx
// Root layout: Stack navigation for app flow
// -----------------------------
import { Stack } from 'expo-router';
import { EntitlementProvider } from '@/contexts/EntitlementContext';

export default function RootLayout() {
  return (
    <EntitlementProvider>
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
    </EntitlementProvider>
  );
}