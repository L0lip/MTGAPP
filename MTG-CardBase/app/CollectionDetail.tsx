import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CardImage from "@/app/CardImage";
import { HomeStyles } from "@/components/Page_style";
import { useRouter } from 'expo-router';
import { useCollections } from '@/components/CollectionContext';
import { useTheme } from "@/components/ThemeContext";
import { useHaptics } from '@/components/HapticContext'; 
import * as Haptics from 'expo-haptics'; 

interface Card {
  id: string;
  name: string;
  image_uris?: {
    small: string;
  };
}

interface Collection {
  id: string;
  name: string;
  cards: Card[];
}

// Inline memoized CardItem component
const CardItem = React.memo(({ card, onPress, onRemove }: { 
  card: { id: string; name: string; smallImageUri?: string };
  onPress: (card: { id: string; name: string; smallImageUri?: string }) => void;
  onRemove: (id: string) => void;
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const textColor = isDark ? "white" : "black";
  const { hapticsEnabled } = useHaptics();

  return (
    <View style={[HomeStyles.card, { backgroundColor: isDark ? "#333" : "#f9f9f9" }]}>
      <TouchableOpacity onPress={() => onPress(card)} style={HomeStyles.cardContent}>
        {card.smallImageUri ? (
          <CardImage uri={card.smallImageUri} />
        ) : (
          <ThemedText>No Image</ThemedText>
        )}
        <ThemedText style={[HomeStyles.cardText, { color: textColor }]}>{card.name}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={HomeStyles.removeButton}
        onPress={() => {onRemove(card.id)
            if (hapticsEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        }}
        activeOpacity={0.7}
      >
        <ThemedText style={HomeStyles.removeButtonText}>Remove</ThemedText>
      </TouchableOpacity>
    </View>
  );
});

export default function CollectionDetail() {
  const router = useRouter();
  const { collections, setCollections } = useCollections();
  const params = useLocalSearchParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const { hapticsEnabled } = useHaptics();

  useEffect(() => {
    if (params.collection) {
      try {
        const parsedCollection = JSON.parse(params.collection as string);
        const updatedCollection = collections.find(col => col.id === parsedCollection.id) || parsedCollection;
        setCollection(updatedCollection);
      } catch (error) {
        console.error("Error parsing collection:", error);
      }
    }
  }, [params.collection, collections]);

  // Memoize the minimal card data
  const minimalCards = useMemo(() => {
    if (!collection) return [];
    return collection.cards.map(card => ({
      id: card.id,
      name: card.name,
      smallImageUri: card.image_uris?.small,
    }));
  }, [collection]);

  const handleCardPress = (card: { id: string; name: string; smallImageUri?: string }) => {
    router.push({
      pathname: "/[id]",
      params: { id: card.id }
    });
  };

  const removeCardFromCollection = (cardId: string) => {
    if (!collection) return;
    const updatedCollection = {
      ...collection,
      cards: collection.cards.filter(card => card.id !== cardId),
    };
    setCollection(updatedCollection);
    setCollections((prevCollections) =>
      prevCollections.map(col => (col.id === collection.id ? updatedCollection : col))
    );
  };

  const confirmRemoveCard = (cardId: string) => {
    Alert.alert(
      "Remove Card",
      "Are you sure you want to remove this card from the collection?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => removeCardFromCollection(cardId) },
      ],
      { cancelable: true }
    );
  };

  const loadMoreCards = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (!collection) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>Error loading collection.</ThemedText>
      </ThemedView>
    );
  }

  // Adjust overlay transparency to make the background image more visible
  const overlayColor = isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
  const textColor = isDark ? "white" : "black";

  return (
      <ThemedView style={[HomeStyles.container, { backgroundColor: overlayColor }]}>
        <ThemedText type="title" style={[styles.collectionName, { color: textColor }]}>
          {collection.name}
        </ThemedText>

        {minimalCards.length > 0 ? (
          <FlatList
            data={minimalCards.slice(0, page * 10)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardItem 
                card={item}
                onPress={() => {{ handleCardPress(item) }
                if (hapticsEnabled) { 
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
            }}
                onRemove={confirmRemoveCard}
              />
            )}
            onEndReached={loadMoreCards}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            numColumns={2}
            columnWrapperStyle={HomeStyles.cardGrid}
          />
        ) : (
          <ThemedText style={[styles.noCardsText, { color: textColor }]}>No cards in this collection.</ThemedText>
        )}
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  collectionName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  noCardsText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
  },
});