import React from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HomeStyles } from '@/components/Page_style';
import { useTheme } from "@/components/ThemeContext";
import { useCollections } from '@/components/CollectionContext';
import { useRouter } from "expo-router";
import CardImage from "@/app/CardImage";
import { useHaptics } from '@/components/HapticContext';
import * as Haptics from 'expo-haptics';

export default function HomePage() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const overlayColor = isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
  const textColor = isDark ? "white" : "black";
  const { collections, recentCardViews } = useCollections();
  const router = useRouter();
  const { hapticsEnabled } = useHaptics();

  // Filter favorited collections
  const favoritedCollections = collections.filter(collection => collection.isFavorite);

  return (
    <ImageBackground 
      source={require('@/assets/images/Colour Pie.png')} 
      style={HomeStyles.backgroundImage}
      resizeMode="contain"
      imageStyle={HomeStyles.backgroundImageStyle}
    >
      <ThemedView style={[HomeStyles.container, {backgroundColor: overlayColor}]}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={HomeStyles.header}>
            <ThemedText type="title" style={{color: textColor}}>MTG Card Database</ThemedText>
          </View>
          
          <ThemedText style={{ color: textColor, textAlign: "center", marginBottom: 20 }}>
            Welcome to the MTG Card Database! Explore and manage your Magic: The Gathering card collections.
          </ThemedText>

          <ThemedText type="subtitle" style={{ color: textColor, marginBottom: 10 }}>
            Favourite Collections
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {favoritedCollections.length > 0 ? (
              favoritedCollections.map(collection => (
                <TouchableOpacity
                  key={collection.id}
                  style={[HomeStyles.card, { backgroundColor: isDark ? "#333" : "#f9f9f9", marginRight: 10 }]}
                  onPress={() =>{
                    router.push({
                      pathname: "/CollectionDetail",
                      params: { collection: JSON.stringify(collection) },
                    })
                    if (hapticsEnabled) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }
              }
                >
                  <ThemedText style={{ color: textColor }}>{collection.name}</ThemedText>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText style={{ color: textColor }}>No favorited collections</ThemedText>
            )}
          </ScrollView>

          <ThemedText type="subtitle" style={{ color: textColor, marginBottom: 10 }}>
            Recent Cards
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {recentCardViews.length > 0 ? (
              recentCardViews.map((card, index) => (
                <TouchableOpacity
                  key={index}
                  style={[HomeStyles.card, styles.cardContainer, { backgroundColor: isDark ? "#333" : "#f9f9f9", marginRight: 10 }]}
                  onPress={() =>{
                    router.push({
                      pathname: "/[id]",
                      params: { id: card.id },
                    })
                    if (hapticsEnabled) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }
                }
                >
                  <CardImage uri={card.imageUri || "https://via.placeholder.com/100"} width={styles.cardImage.width} height={styles.cardImage.height} />
                  <ThemedText style={{ color: textColor, textAlign: "center" }}>{card.name}</ThemedText>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText style={{ color: textColor }}>No recent activity</ThemedText>
            )}
          </ScrollView>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 130,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 100,
    height: 140,
  },
});