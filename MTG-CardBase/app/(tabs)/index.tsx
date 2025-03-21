import React, { useState } from "react";
import { View, TextInput, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from @expo/vector-icons
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HomeStyles } from '@/components/Page_style';
import { useTheme } from "@/components/ThemeContext";

export default function HomePage() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const overlayColor = isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
  const textColor = isDark ? "white" : "black";

  return (
    <ImageBackground 
      source={require('@/assets/images/Colour Pie.png')} 
      style={HomeStyles.backgroundImage}
      resizeMode="contain"
      imageStyle={HomeStyles.backgroundImageStyle}
    >
      <ThemedView style={[HomeStyles.container, {backgroundColor: overlayColor}]}>
        <View style={HomeStyles.header}>
          <ThemedText type="title" style={{color: textColor}}>MTG Card Database</ThemedText>
        </View>
      </ThemedView>
    </ImageBackground>
  );
}