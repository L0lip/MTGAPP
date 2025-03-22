import React from 'react';
import { View, TouchableOpacity, ImageBackground, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { HomeStyles } from '@/components/Page_style';
import { useTheme } from '@/components/ThemeContext';
import * as Haptics from 'expo-haptics';
import { useHaptics } from '@/components/HapticContext'; 
import { Settingsstyles } from '@/components/Settings_Style';

export default function SettingsPage() {
  const { selectedTheme, effectiveTheme, setSelectedTheme } = useTheme();
  const { hapticsEnabled, toggleHaptics } = useHaptics(); // Access global haptic state

  // Define overlay color with reduced opacity for better background visibility
  const overlayColor = effectiveTheme === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = effectiveTheme === 'light' ? 'black' : 'white';

  const handleThemeChange = (mode: 'auto' | 'light' | 'dark') => {
    setSelectedTheme(mode);
    // Trigger haptic feedback globally if enabled
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/Colour Pie.png')}
      style={HomeStyles.backgroundImage}
      resizeMode="contain"
      imageStyle={HomeStyles.backgroundImageStyle}
    >
      <View style={[HomeStyles.container, { backgroundColor: overlayColor }]}>
        <View style={Settingsstyles.header}>
          <ThemedText type="title" style={{ color: textColor }}>
            MTG Card Database
          </ThemedText>
        </View>

        <View style={Settingsstyles.settingsContainer}>
          {/* Theme Selector */}
          <View style={Settingsstyles.settingsCard}>
            <ThemedText style={[Settingsstyles.selectorLabel, { color: textColor }]}>
              Theme Mode:
            </ThemedText>
            <View style={Settingsstyles.buttonRow}>
              <TouchableOpacity
                style={[Settingsstyles.button, selectedTheme === 'auto' && Settingsstyles.selectedButton]}
                onPress={() => handleThemeChange('auto')}
              >
                <ThemedText style={[Settingsstyles.buttonText, { color: textColor }]}>Auto</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Settingsstyles.button, selectedTheme === 'light' && Settingsstyles.selectedButton]}
                onPress={() => handleThemeChange('light')}
              >
                <ThemedText style={[Settingsstyles.buttonText, { color: textColor }]}>Light</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Settingsstyles.button, selectedTheme === 'dark' && Settingsstyles.selectedButton]}
                onPress={() => handleThemeChange('dark')}
              >
                <ThemedText style={[Settingsstyles.buttonText, { color: textColor }]}>Dark</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Haptic Feedback Toggle */}
          <View style={Settingsstyles.settingsCard}>
            <ThemedText style={[Settingsstyles.selectorLabel, { color: textColor }]}>
              Haptic Feedback:
            </ThemedText>
            <Switch 
              value={hapticsEnabled} 
              onValueChange={() => {
                toggleHaptics();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}