import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { HomeStyles } from '@/components/Page_style';
import { useTheme } from "@/components/ThemeContext";
import { useCollections } from "@/components/CollectionContext";

interface Card {
  id: string;
  name: string;
  type_line?: string;
  oracle_text?: string;
  mana_cost?: string;
  image_uris?: {
    normal: string;
    small: string;
  };
}

export default function CardDetail() {
  const { id } = useLocalSearchParams(); // Expecting an `id` parameter from a dynamic route
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const { addRecentCardView } = useCollections();

  useEffect(() => {
    console.log("Card ID from params:", id);
    if (id) {
      fetch(`https://api.scryfall.com/cards/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setCard(data);
          setLoading(false);
          addRecentCardView({
            id: data.id,
            name: data.name,
            imageUri: data.image_uris?.small,
            timestamp: Date.now(),
          });
        })
        .catch((error) => {
          console.error("Error fetching card details:", error);
          setLoading(false);
        });
    } else {
      // No id was provided; stop loading and show an error or fallback UI
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </ThemedView>
    );
  }

  if (!card) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.errorText}>Card not found.</ThemedText>
      </ThemedView>
    );
  }

  // Adjust overlay transparency to make the background image more visible
  const overlayColor = isDark ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
  const textColor = isDark ? "white" : "black";

  return (
      <ThemedView style={[HomeStyles.container, { backgroundColor: overlayColor }]}>
        <View style={HomeStyles.header}>
          <ThemedText type="title" style={{ color: textColor }}>MTG Card Database</ThemedText>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={{ uri: card.image_uris?.normal || "https://via.placeholder.com/300" }}
            style={styles.cardImage}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <ThemedText style={[styles.cardName, { color: textColor }]}>{card.name}</ThemedText>
            <ThemedText style={[styles.manaCost, { color: textColor }]}>{card.mana_cost}</ThemedText>
            <ThemedText style={[styles.typeLine, { color: textColor }]}>{card.type_line}</ThemedText>
            <ThemedText style={[styles.oracleText, { color: textColor }]}>{card.oracle_text}</ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  cardImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },
  manaCost: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  typeLine: {
    fontSize: 16,
    color: "#ccc",
    marginVertical: 5,
  },
  oracleText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
});