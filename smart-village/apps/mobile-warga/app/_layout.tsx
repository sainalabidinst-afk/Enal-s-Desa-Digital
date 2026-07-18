import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="letter/[id]" options={{ title: 'Detail Surat' }} />
      <Stack.Screen name="complaint/[id]" options={{ title: 'Detail Pengaduan' }} />
    </Stack>
  );
}
