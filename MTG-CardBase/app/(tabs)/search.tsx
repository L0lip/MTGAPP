import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Modal, Button, Alert, ActivityIndicator, ImageBackground, StyleSheet } from "react-native";
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
import Camera, { CameraType } from 'expo-camera';
import { CameraView, useCameraPermissions } from 'expo-camera';

console.log('CameraType:', CameraType);


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
  const [activeModal, setActiveModal] = useState<'none' | 'scan' | 'collection'>('none');
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  
  const cameraRef = useRef<Camera | null>(null);
  const [type, setType] = useState(CameraType?.back || 'back');
  const [scanning, setScanning] = useState(false);
  
  
  

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
    // Add fetchCards() here instead of in a separate useEffect
    fetchCards();
  }, [search, selectedSet, selectedColor]);

  useEffect(() => {
    if (activeModal !== 'none') {
      // Show active modal logic
      setModalVisible(true);
    } else {
      setModalVisible(false); // Close modal when 'none'
    }
  }, [activeModal]);

  // Function to handle the capture of a card image
  const captureCardImage = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false
      });
  
      if (photo.uri) {
        setScanning(true);
        // Show a preview of the captured image
        Alert.alert(
          "Card Captured",
          "Would you like to scan this card?",
          [
            {
              text: "Cancel",
              onPress: () => setScanning(false),
              style: "cancel"
            },
            {
              text: "Scan",
              onPress: async () => {
                await scanCard(photo.uri);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image');
      setScanning(false);
    }
  };
  
  // Function to send the image to the API
  const scanCard = async (imageUri: string) => {
    try {
      // First attempt to get card info from Scryfall using image
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'card.jpg',
      });
  
      // You'll need to replace this with your actual card recognition API endpoint
      const response = await fetch('https://gitlab.com/magic-card-scanner/magic-card-scanner-api', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const data = await response.json();
      
      if (data.card) {
        setSelectedCard(data.card);
        setActiveModal('collection'); // Open collection modal to add card
      } else {
        Alert.alert('Card Not Found', 'Could not recognize the card. Please try again.');
      }
    } catch (error) {
      console.error('Error scanning card:', error);
      Alert.alert('Scan Failed', 'There was an error scanning the card.');
    } finally {
      setScanning(false);
    }
  };

  // Update the fetchCards function
const fetchCards = () => {
  setLoading(true);
  let query = [];
  
  // Add search term if present
  if (search) {
    query.push(search);
  }
  
  // Add set filter if selected
  if (selectedSet) {
    query.push(`set:${selectedSet}`);
  }
  
  // Add color filter if selected
  if (selectedColor) {
    if (selectedColor === "multicolor") {
      query.push("c>1"); // Cards with more than one color
    } else if (selectedColor === "colorless") {
      // Updated colorless query to exclude lands and only show truly colorless cards
      query.push("(c=0 -t:land) or m={C}"); // Cards with no colors (excluding lands) OR cards with colorless mana cost
    } else if (selectedColor === "land") {
      query.push("t:land"); // Search for lands
    } else {
      query.push(`c:${selectedColor}`); // Specific color
    }
  }

  // Join all query parts with AND operator
  const finalQuery = query.join(" ");
  
  fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(finalQuery)}&unique=cards&order=name&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.object === "list") {
        const newCards = data.data;
        setCards((prevCards) => {
          if (page === 1) {
            return newCards; // Replace all cards if it's the first page
          }
          // Add new cards while preventing duplicates
          const existingIds = new Set(prevCards.map(card => card.id));
          const uniqueNewCards = newCards.filter(card => !existingIds.has(card.id));
          return [...prevCards, ...uniqueNewCards];
        });
        setHasMore(data.has_more);
      } else {
        setHasMore(false);
        if (page === 1) {
          setCards([]); // Clear cards if no results found
        }
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching cards:", error);
      setLoading(false);
      setHasMore(false);
      if (page === 1) {
        setCards([]); // Clear cards on error
      }
    });
};

// Update the useEffect for search changes
useEffect(() => {
  setCards([]); // Clear existing cards
  setPage(1); // Reset to first page
  setHasMore(true); // Reset hasMore flag
  fetchCards(); // Fetch new results
}, [search, selectedSet, selectedColor]); // Dependencies that should trigger a new search

// Update loadMoreCards function
const loadMoreCards = () => {
  if (!loading && hasMore) {
    setPage(prev => prev + 1);
    fetchCards();
  }
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
  const filteredColors = ["w", "u", "b", "r", "g", "multicolor", "colorless", "land"]
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
        return cardColorsLower.length > 1;
      } else if (selectedColor === "colorless") {
        // Only show cards that are truly colorless (no colors and not a land)
        return cardColorsLower.length === 0 && !card.type_line?.toLowerCase().includes('land');
      } else if (selectedColor === "land") {
        return card.type_line?.toLowerCase().includes('land');
      }

      return cardColorsLower.includes(selectedColorLower); // Check if the selected color is in the card's colors
    }

    return true; // If no color filter is selected, return all cards
  });

  // Adjust overlay transparency to make the background image more visible
  const overlayColor = isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
  const textColor = isDark ? "white" : "black";

  // Add this function after your existing state declarations
  const clearFilters = () => {
    setSelectedColor("");
    setSelectedSet("");
    setColorSearch("");
    setSearchSets("");
    setPage(1);
  };

  // Add these functions after your existing state declarations
const clearSearchFilter = () => {
  setSearch("");
};

const clearColorFilter = () => {
  setSelectedColor("");
  setColorSearch("");
};

const clearSetFilter = () => {
  setSelectedSet("");
  setSearchSets("");
};

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
        {/* Add a button to open the camera */}
        <TouchableOpacity onPress={() => {
  if (permission) {
    setActiveModal('scan'); // Only open modal if permission is granted
  } else {
    Alert.alert('Permission Denied', 'Please grant camera access to scan a card.');
  }
}}>
  <Ionicons name="camera" size={30} color={textColor} />
  <ThemedText style={{ color: textColor}}>Scan Card</ThemedText>
</TouchableOpacity>

        {/* Camera Modal */}
        {activeModal === 'scan' && (
    <Modal visible={activeModal === 'scan'} transparent={false} animationType="slide">
      <View style={{ flex: 1 }}>
        {!permission ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : !permission.granted ? (
          <View style={styles.container}>
            <ThemedText>We need your permission to show the camera</ThemedText>
            <Button onPress={requestPermission} title="Grant Permission" />
          </View>
        ) : scanning ? (
          <View style={[styles.container, { alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#0000ff" />
            <ThemedText style={{ marginTop: 20 }}>Scanning card...</ThemedText>
          </View>
        ) : (
          <View style={styles.container}>
            <CameraView 
              style={styles.camera} 
              facing={facing}
              ref={cameraRef}
            >
              <View style={{position: "absolute",inset: 0, width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity 
                  style={styles.captureButton}
                  onPress={captureCardImage}
                >
                  <Ionicons name="camera" size={40} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                >
                  <Ionicons name="camera-reverse" size={30} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setActiveModal('none')}
                >
                  <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        )}
      </View>
    </Modal>
  )}

          
          {/* Search Section */}
        <View style={HomeStyles.searchContainer}>
          <TextInput
            style={[HomeStyles.searchInput]} // Change typed text color to match theme
            placeholder="Search for a card..."
            placeholderTextColor={"black"}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" style={HomeStyles.searchIcon} size={20} color={textColor} />
          {search && (
    <TouchableOpacity
      style={[HomeStyles.clearSearchButton, { backgroundColor: isDark ? "#444" : "#ddd" }]}
      onPress={() => {
        clearSearchFilter();
        if (hapticsEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
    >
      <Ionicons name="close-circle" size={20} color={textColor} />
    </TouchableOpacity>
  )}
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
          {(selectedColor || colorSearch) && (
    <TouchableOpacity
      style={[HomeStyles.clearFilterButton, { backgroundColor: isDark ? "#444" : "#ddd" }]}
      onPress={() => {
        clearColorFilter();
        if (hapticsEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
    >
      <Ionicons name="close-circle" size={20} color={textColor} />
    </TouchableOpacity>
  )}
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
          {(selectedSet || searchSets) && (
    <TouchableOpacity
      style={[HomeStyles.clearFilterButton, { backgroundColor: isDark ? "#444" : "#ddd" }]}
      onPress={() => {
        clearSetFilter();
        if (hapticsEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
    >
      <Ionicons name="close-circle" size={20} color={textColor} />
    </TouchableOpacity>
  )}
        </View>

        {/* Clear Filters Button */}
        <TouchableOpacity
          style={[HomeStyles.clearButton, { backgroundColor: isDark ? "#444" : "#ddd" }]}
          onPress={() => {
            clearFilters();
            if (hapticsEnabled) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
        >
          <ThemedText style={[HomeStyles.clearButtonText, { color: textColor }]}>
            Clear Filters
          </ThemedText>
        </TouchableOpacity>

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
                onPress={() => {
                  handleAddCard(card)
                  if (hapticsEnabled) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setActiveModal('collection')
                  
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

        {/* Collection Selection Modal */}
        {activeModal === 'collection' && (
  <Modal visible={activeModal === 'collection'} transparent animationType="slide">
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.7)" }}>
      <ThemedView style={{ padding: 20, backgroundColor: "#333", borderRadius: 10 }}>
        <ThemedText>Select a Collection</ThemedText>
        {collections.map((collection) => (
          <TouchableOpacity
            key={collection.id}
            onPress={() => {
              addToCollection(collection.id);
              setActiveModal('none'); // Close the modal after adding
            }}
            style={HomeStyles.collectionButton}
          >
            <ThemedText style={HomeStyles.collectionButtonText}>{collection.name}</ThemedText>
          </TouchableOpacity>
        ))}
        <Button title="Cancel" onPress={() => setActiveModal('none')} />
      </ThemedView>
    </View>
  </Modal>
)}
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 50,
  },
  flipButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  }
});