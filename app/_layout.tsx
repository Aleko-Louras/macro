import { Stack, Route } from "expo-router";
import MacrosProvider from '@/app/Providers/MacrosContext'
export default function RootLayout() {
  return <MacrosProvider>
    <Stack>
    <Stack.Screen name="index" options={{headerShown: false}}/>
    <Stack.Screen name="camera" options={{headerShown: false}}/>
  </Stack>
  </MacrosProvider>
}
