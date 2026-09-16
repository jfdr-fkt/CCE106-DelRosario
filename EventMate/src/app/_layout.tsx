import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Hides the header for the tabs so we don't get double headers */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="event/[id]" options={{ title: 'Event Details' }} />
    </Stack>
  );
}