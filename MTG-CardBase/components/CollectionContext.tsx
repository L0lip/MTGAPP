import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define interfaces for your collections and cards
interface Card {
  id: string;
  name: string;
  imageUri?: {
    small: string;
  };
}

interface Collection {
  id: string;
  name: string;
  cards: Card[];
}

// Create the CollectionContext
const CollectionContext = createContext<{
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
} | null>(null);

// Custom hook to access the context
export const useCollections = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionProvider");
  }
  return context;
};

// CollectionProvider to wrap around your app and provide collections state
export const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  // Load collections from AsyncStorage when the app starts
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const storedCollections = await AsyncStorage.getItem('collections');
        if (storedCollections) {
          setCollections(JSON.parse(storedCollections));
        }
      } catch (error) {
        console.error("Error loading collections from AsyncStorage:", error);
      }
    };

    loadCollections();
  }, []);

  // Save collections to AsyncStorage whenever they change
  useEffect(() => {
    const saveCollections = async () => {
      try {
        await AsyncStorage.setItem('collections', JSON.stringify(collections));
      } catch (error) {
        console.error("Error saving collections to AsyncStorage:", error);
      }
    };

    saveCollections();
  }, [collections]);

  return (
    <CollectionContext.Provider value={{ collections, setCollections }}>
      {children}
    </CollectionContext.Provider>
  );
};