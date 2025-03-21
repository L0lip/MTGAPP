import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Modal, Button, Alert, ActivityIndicator, ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HomeStyles } from "@/components/Page_style";
import { Picker } from '@react-native-picker/picker';
import CardImage from "@/app/CardImage";
import { useCollections } from "@/components/CollectionContext"; // Importing the hook
import { useTheme } from "@/components/ThemeContext";
import { useHaptics } from '@/components/HapticContext'; 
import * as Haptics from 'expo-haptics'; 

interface Card {
  id: string;
  name: string;
  image_uris?: {
    small: string;
  };
  colors: string[]; // Colors array for filtering
  set: string; // Set code (e.g., "M21")
}

interface Set {
  code: string;
  name: string;
}

export default function SearchPage() {
  const router = useRouter();
  const { collections, setCollections } = useCollections(); // Using the hook to access collections
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [search, setSearch] = useState(""); // Main search query
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(""); // Track selected color
  const [selectedSet, setSelectedSet] = useState<string>(""); // Track selected set
  const [sets, setSets] = useState<Set[]>([]); // State to store sets
  const [colorSearch, setColorSearch] = useState<string>(""); // Search input for colors
  const [searchSets, setSearchSets] = useState<string>(""); // Search input for sets
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); // State to store selected card
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(false); // State to control loading indicator
  const [page, setPage] = useState(1); // State to track the current page for pagination
  const [hasMore, setHasMore] = useState(true); // State to track if there are more cards to load
  const { hapticsEnabled } = useHaptics(); // Access the hapticsEnabled state

  // Fetch sets when the component mounts
  useEffect(() => {
    fetch("https://api.scryfall.com/sets")
      .then((response) => response.json())
      .then((data) => {
        // Filter to include only sets with code and name
        const availableSets = data.data.filter((set: any) => set.code && set.name);
        setSets(availableSets);
      })
      .catch((error) => console.error("Error fetching sets:", error));
  }, []);

  useEffect(() => {
    setCards([]); // Reset cards when search, selectedSet, or selectedColor changes
    setPage(1); // Reset page to 1
    setHasMore(true); // Reset hasMore to true
  }, [search, selectedSet, selectedColor]);

  useEffect(() => {
    if (hasMore) {
      fetchCards();
    }
  }, [search, selectedSet, selectedColor, page]); // Re-fetch when search, selectedSet, selectedColor, or page changes

  const fetchCards = () => {
    setLoading(true);
    let query = `q=${encodeURIComponent(search)}`;
    if (selectedSet) query += `+set:${selectedSet}`;
    if (selectedColor) query += `+color:${selectedColor}`;

    fetch(`https://api.scryfall.com/cards/search?${query}&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.object === "list") {
          const sortedCards = data.data.sort((a: Card, b: Card) => a.name.localeCompare(b.name)); // Sort alphabetically
          setCards((prevCards) => [...prevCards, ...sortedCards]); // Append new cards to existing list
          setHasMore(data.has_more); // Update hasMore based on API response
        } else {
          setHasMore(false); // No more cards to load
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
        setLoading(false);
      });
  };

  const handleAddCard = (card: Card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const addToCollection = (collectionID: string) => {
    if (selectedCard) {
      setCollections((prevCollections) => {
        return prevCollections.map((collection) => {
          if (collection.id === collectionID) {
            // Check if the card already exists in the collection
            const cardExists = collection.cards.some((c) => c.id === selectedCard.id);
            if (cardExists) {
              Alert.alert("Duplicate Card", "This card is already in the collection.");
              return collection;
            }
            return { ...collection, cards: [...collection.cards, selectedCard] };
          }
          return collection;
        });
      });
      setModalVisible(false);
    }
  };

  const handleCardPress = (card: Card) => {
    router.push({
      pathname: "/[id]",
      params: { id: card.id }
    });
  };

  // Filter color options based on search input
  const filteredColors = ["w", "u", "b", "r", "g", "multicolor", "colorless"]
    .filter((color) =>
      color.toLowerCase().includes(colorSearch.toLowerCase()) // Check if the search term is part of the color string
    );

  // Filter set options based on search input
  const filteredSets = sets.filter((set) =>
    set.name.toLowerCase().includes(searchSets.toLowerCase()) // Check if the search term is part of the set name
  );

  // Apply color filter after fetching cards
  const filteredCards = cards.filter((card) => {
    if (selectedColor) {
      const selectedColorLower = selectedColor.toLowerCase();
      const cardColorsLower = card.colors ? card.colors.map((color) => color.toLowerCase()) : [];

      if (selectedColor === "multicolor") {
        return cardColorsLower.length > 1; // Check if card has more than one color for multicolor
      }

      return cardColorsLower.includes(selectedColorLower); // Check if the selected color is in the card's colors
    }

    return true; // If no color filter is selected, return all cards
  });

  const loadMoreCards = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Adjust overlay transparency to make the background image more visible
  const overlayColor = isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
  const textColor = isDark ? "white" : "black";

  return (
    <ImageBackground
      source={require('@/assets/images/Colour Pie.png')} 
      style={HomeStyles.backgroundImage}
      imageStyle={HomeStyles.backgroundImageStyle}
      resizeMode="contain"
    >
      <ThemedView style={[HomeStyles.container, { backgroundColor: overlayColor }]}>
        <View style={HomeStyles.header}>
          <ThemedText type="title" style={{ color: textColor }}>MTG Card Database</ThemedText>
        </View>
        <View style={HomeStyles.searchContainer}>
          <TextInput
            style={[HomeStyles.searchInput]} // Change typed text color to match theme
            placeholder="Search for a card..."
            placeholderTextColor={"black"}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" style={HomeStyles.searchIcon} size={20} color={textColor} />
        </View>

        {/* Filter Section */}
        {/* Color Filter */}
        <View style={HomeStyles.filterContainer}>
          <TextInput
            style={[HomeStyles.filterSearchInput, { color: textColor }]} // Change typed text color to match theme
            placeholder="Search for a color..."
            placeholderTextColor={textColor}
            value={colorSearch}
            onChangeText={setColorSearch}
          />
          <Picker
            selectedValue={selectedColor}
            style={[HomeStyles.filterPicker, { color: textColor }]} // Change picker text color to match theme
            onValueChange={(itemValue) => setSelectedColor(itemValue)}
            itemStyle={{ color: textColor }} // Change dropdown item text color to match theme
          >
            <Picker.Item label="Filter by Color" value="" />
            {filteredColors.map((color) => (
              <Picker.Item key={color} label={color.toUpperCase()} value={color} />
            ))}
          </Picker>
        </View>

        {/* Set Filter */}
        <View style={HomeStyles.filterContainer}>
          <TextInput
            style={[HomeStyles.filterSearchInput, { color: textColor }]} // Change typed text color to match theme
            placeholder="Search for a set..."
            placeholderTextColor={textColor}
            value={searchSets}
            onChangeText={setSearchSets}
          />
          <Picker
            selectedValue={selectedSet}
            style={[HomeStyles.filterPicker, { color: textColor }]} // Change picker text color to match theme
            onValueChange={(itemValue) => setSelectedSet(itemValue)}
            itemStyle={{ color: textColor }}
          >
            <Picker.Item label="Filter by Set" value="" />
            {filteredSets.map((set) => (
              <Picker.Item key={set.code} label={set.name} value={set.code}/>
            ))}
          </Picker>
        </View>

        {/* Card Grid */}
        <FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id}
          renderItem={({ item: card }) => (
            <View style={[HomeStyles.card, { backgroundColor: isDark ? "#333" : "#f9f9f9" }]}>
              <TouchableOpacity onPress={() => {handleCardPress(card)
                if (hapticsEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }} 
              
              style={HomeStyles.cardContent}>
                {card.image_uris?.small ? (
                  <CardImage uri={card.image_uris.small} />
                ) : (
                  <ThemedText>No Image</ThemedText>
                )}
                <ThemedText style={[HomeStyles.cardText, { color: textColor }]}>{card.name}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={HomeStyles.addButton}
                onPress={() => {handleAddCard(card)
                  if (hapticsEnabled) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                activeOpacity={0.7}
              >
                <ThemedText style={HomeStyles.addButtonText}>Add to Collection</ThemedText>
              </TouchableOpacity>
            </View>
          )}
          onEndReached={loadMoreCards}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
          numColumns={2} // Ensure two columns for grid layout
          columnWrapperStyle={HomeStyles.cardGrid} // Apply grid style to column wrapper
        />

        {/* Modal to Select a Collection */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.7)" }}>
            <ThemedView style={{ padding: 20, backgroundColor: "#333", borderRadius: 10 }}>
              <ThemedText>Select a Collection</ThemedText>
              {collections.map((collection) => (
                <TouchableOpacity
                  key={collection.id}
                  onPress={() => {addToCollection(collection.id)
                    if (hapticsEnabled) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  style={HomeStyles.collectionButton}
                >
                  <ThemedText style={HomeStyles.collectionButtonText}>{collection.name}</ThemedText>
                </TouchableOpacity>
              ))}
              <Button title="Cancel" onPress={() => {setModalVisible(false)
                if (hapticsEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }} />
            </ThemedView>
          </View>
        </Modal>
      </ThemedView>
    </ImageBackground>
  );
}