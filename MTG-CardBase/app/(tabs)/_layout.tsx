import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HomeStyles } from '@/components/Page_style';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';
import { useHaptics } from '@/components/HapticContext'; // Import the useHaptics hook
import * as Haptics from 'expo-haptics'; // Import expo-haptics to trigger feedback
import { StatusBar } from 'expo-status-bar'; // Import StatusBar

export default function TabLayout() {
  const { effectiveTheme } = useTheme();
  const { hapticsEnabled } = useHaptics(); // Get the global haptic feedback state
  const isDark = effectiveTheme === 'dark';

  // Function to trigger haptic feedback
  const handleTabPress = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? Colors.dark.tint : Colors.light.tint,
          tabBarInactiveTintColor: isDark ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
          headerShown: false,
          tabBarButton: (props) => (
            <HapticTab {...props} handleTabPress={handleTabPress} /> // Attach haptic feedback on press
          ),
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass.circle.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}