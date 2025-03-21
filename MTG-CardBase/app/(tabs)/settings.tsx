import React from 'react';
import { View, TouchableOpacity, ImageBackground, StyleSheet, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { HomeStyles } from '@/components/Page_style';
import { useTheme } from '@/components/ThemeContext';
import * as Haptics from 'expo-haptics';
import { useHaptics } from '@/components/HapticContext'; // Import the hook

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
        <View style={styles.header}>
          <ThemedText type="title" style={{ color: textColor }}>
            MTG Card Database
          </ThemedText>
        </View>

        <View style={styles.settingsContainer}>
          {/* Theme Selector */}
          <View style={styles.settingsCard}>
            <ThemedText style={[styles.selectorLabel, { color: textColor }]}>
              Theme Mode:
            </ThemedText>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, selectedTheme === 'auto' && styles.selectedButton]}
                onPress={() => handleThemeChange('auto')}
              >
                <ThemedText style={[styles.buttonText, { color: textColor }]}>Auto</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, selectedTheme === 'light' && styles.selectedButton]}
                onPress={() => handleThemeChange('light')}
              >
                <ThemedText style={[styles.buttonText, { color: textColor }]}>Light</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, selectedTheme === 'dark' && styles.selectedButton]}
                onPress={() => handleThemeChange('dark')}
              >
                <ThemedText style={[styles.buttonText, { color: textColor }]}>Dark</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Haptic Feedback Toggle */}
          <View style={styles.settingsCard}>
            <ThemedText style={[styles.selectorLabel, { color: textColor }]}>
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

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 39.4,
  },
  settingsContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    flex: 1,
  },
  settingsCard: {
    backgroundColor: 'rgba(155, 155, 155, 0.3)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, 
  },
  selectorLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light transparent background for contrast
  },
  selectedButton: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.3)', // Slight blue tint for selection
  },
  buttonText: {
    fontSize: 16,
  },
});
