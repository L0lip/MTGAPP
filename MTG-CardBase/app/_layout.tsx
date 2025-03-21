import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CollectionProvider } from '@/components/CollectionContext';
import { ThemeProvider, useTheme } from '@/components/ThemeContext';
import { HapticProvider } from '@/components/HapticContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <HapticProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </HapticProvider>
  );
}

// This component consumes the theme from the ThemeContext and provides the NavigationThemeProvider.
function AppContent() {
  const { effectiveTheme } = useTheme(); // Get the effective theme from context

  return (
    <CollectionProvider>
      <NavigationThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
      </NavigationThemeProvider>
    </CollectionProvider>
  );
}