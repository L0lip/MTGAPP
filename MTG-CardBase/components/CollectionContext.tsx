import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  isFavorite?: boolean;
}

interface RecentActivity {
  type: "view" | "favorite" | "add" | "remove";
  collectionId: string;
  collectionName: string;
  timestamp: number;
}

interface RecentCardView {
  id: string;
  name: string;
  imageUri?: string;
  timestamp: number;
}

// Create the CollectionContext
const CollectionContext = createContext<{
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  toggleFavorite: (id: string) => void;
  recentActivity: RecentActivity[];
  addRecentActivity: (activity: RecentActivity) => void;
  recentCardViews: RecentCardView[];
  addRecentCardView: (card: RecentCardView) => void;
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
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recentCardViews, setRecentCardViews] = useState<RecentCardView[]>([]);

  useEffect(() => {
    const loadCollections = async () => {
      const storedCollections = await AsyncStorage.getItem("collections");
      if (storedCollections) {
        setCollections(JSON.parse(storedCollections));
      }
    };

    const loadRecentActivity = async () => {
      const storedRecentActivity = await AsyncStorage.getItem("recentActivity");
      if (storedRecentActivity) {
        setRecentActivity(JSON.parse(storedRecentActivity));
      }
    };

    const loadRecentCardViews = async () => {
      const storedRecentCardViews = await AsyncStorage.getItem("recentCardViews");
      if (storedRecentCardViews) {
        setRecentCardViews(JSON.parse(storedRecentCardViews));
      }
    };

    loadCollections();
    loadRecentActivity();
    loadRecentCardViews();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("collections", JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    AsyncStorage.setItem("recentActivity", JSON.stringify(recentActivity));
  }, [recentActivity]);

  useEffect(() => {
    AsyncStorage.setItem("recentCardViews", JSON.stringify(recentCardViews));
  }, [recentCardViews]);

  const toggleFavorite = (id: string) => {
    setCollections((prevCollections) =>
      prevCollections.map((collection) =>
        collection.id === id ? { ...collection, isFavorite: !collection.isFavorite } : collection
      )
    );
    const collection = collections.find((col) => col.id === id);
    if (collection) {
      addRecentActivity({
        type: "favorite",
        collectionId: collection.id,
        collectionName: collection.name,
        timestamp: Date.now(),
      });
    }
  };

  const addRecentActivity = (activity: RecentActivity) => {
    setRecentActivity((prevActivity) => [activity, ...prevActivity].slice(0, 10)); // Keep only the last 10 activities
  };

  const addRecentCardView = (card: RecentCardView) => {
    setRecentCardViews((prevViews) => {
      const updatedViews = [card, ...prevViews.filter((view) => view.id !== card.id)];
      return updatedViews.slice(0, 3); // Keep only the last 3 viewed cards
    });
  };

  return (
    <CollectionContext.Provider value={{ collections, setCollections, toggleFavorite, recentActivity, addRecentActivity, recentCardViews, addRecentCardView }}>
      {children}
    </CollectionContext.Provider>
  );
};