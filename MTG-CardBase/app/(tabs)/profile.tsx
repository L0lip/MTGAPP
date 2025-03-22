import React, { useState } from "react";
import { View, TextInput, ScrollView, TouchableOpacity, Button, Alert, ImageBackground, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HomeStyles } from '@/components/Page_style';
import { useRouter } from "expo-router";
import { useCollections } from '@/components/CollectionContext';
import { useTheme } from "@/components/ThemeContext";
import { useHaptics } from '@/components/HapticContext'; // Import the useHaptics hook
import * as Haptics from 'expo-haptics'; // Import expo-haptics to trigger feedback

export default function ProfilePage() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const { collections, setCollections, toggleFavorite, addRecentActivity } = useCollections();
  const [newCollectionName, setNewCollectionName] = useState("");
  const router = useRouter();
  const { hapticsEnabled } = useHaptics(); 

  const addCollection = (name: string) => {
    if (!name.trim()) return;
    const newCollection = { id: Date.now().toString(), name, cards: [], isFavorite: false };
    setCollections((prev) => [...prev, newCollection]);
    setNewCollectionName("");
    addRecentActivity({
      type: "add",
      collectionId: newCollection.id,
      collectionName: newCollection.name,
      timestamp: Date.now(),
    });
  };

  const removeCollection = (collectionID: string) => {
    const collection = collections.find((col) => col.id === collectionID);
    if (collection) {
      addRecentActivity({
        type: "remove",
        collectionId: collection.id,
        collectionName: collection.name,
        timestamp: Date.now(),
      });
    }
    setCollections(collections.filter((col) => col.id !== collectionID));
  };

  const confirmRemoveCollection = (collectionID: string) => {
    Alert.alert(
      "Delete Collection",
      "Are you sure you want to delete this collection?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => removeCollection(collectionID) },
      ],
      { cancelable: true }
    );
  };

  const navigateToCollection = (collection: Collection) => {
    router.push({
      pathname: "/CollectionDetail",
      params: { collection: JSON.stringify(collection) },
    });
    addRecentActivity({
      type: "view",
      collectionId: collection.id,
      collectionName: collection.name,
      timestamp: Date.now(),
    });
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
        <View style={[HomeStyles.container, { backgroundColor: overlayColor }]}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
            <ThemedText type="title" style={{ color: textColor, textAlign: "center" }}>
              Your Collections
            </ThemedText>
            
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <TextInput
                placeholder="New collection name"
                placeholderTextColor={textColor}
                value={newCollectionName}
                onChangeText={setNewCollectionName}
                style={{
                  flex: 1,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  padding: 8,
                  marginRight: 10,
                  color: textColor,
                  backgroundColor: isDark ? "#333" : "#f9f9f9",
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  addCollection(newCollectionName);
                  if (hapticsEnabled) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={{
                  backgroundColor: "#007bff",
                  padding: 10,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ThemedText>Add</ThemedText>
              </TouchableOpacity>
            </View>

            {collections.map((collection) => (
              <View 
                key={collection.id} 
                style={{ 
                  flexDirection: "row", 
                  alignItems: "center", 
                  padding: 10, 
                  borderBottomColor: "#ccc", 
                  borderBottomWidth: 1 
                }}
              >
                <TouchableOpacity 
                  style={{ flex: 1 }}
                  onPress={() => navigateToCollection(collection)}
                >
                  <ThemedText style={{ color: textColor }}>{collection.name}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {confirmRemoveCollection(collection.id)
                    if (hapticsEnabled) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}>
                  <Ionicons name="trash-outline" size={24} color={textColor} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {toggleFavorite(collection.id)
                    if (hapticsEnabled) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}>
                  <Ionicons name={collection.isFavorite ? "heart" : "heart-outline"} size={24} color={textColor} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
    </ImageBackground>
  );
}