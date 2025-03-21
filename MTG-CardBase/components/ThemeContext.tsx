import React, { createContext, useState, useContext, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the possible theme modes
type ThemeMode = "auto" | "light" | "dark";

interface ThemeContextProps {
  selectedTheme: ThemeMode;
  effectiveTheme: "light" | "dark";
  setSelectedTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  selectedTheme: "auto",
  effectiveTheme: "light",
  setSelectedTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Use "auto" by default
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>("auto");
  // Track the current system theme ("light" or "dark")
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(Appearance.getColorScheme() || "light");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setSelectedTheme(storedTheme as ThemeMode);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme || "light");
    });
    return () => listener.remove();
  }, []);

  // If in "auto" mode, use the system theme; otherwise, use the manually selected theme.
  const effectiveTheme = selectedTheme === "auto" ? systemTheme : selectedTheme;

  // Toggle between light and dark. If currently in auto, toggle to the opposite of the system theme.
  const toggleTheme = () => {
    if (selectedTheme === "auto") {
      setSelectedTheme(systemTheme === "dark" ? "light" : "dark");
    } else {
      setSelectedTheme(selectedTheme === "dark" ? "light" : "dark");
    }
  };

  const handleSetSelectedTheme = async (mode: ThemeMode) => {
    setSelectedTheme(mode);
    await AsyncStorage.setItem("theme", mode);
  };

  return (
    <ThemeContext.Provider value={{ selectedTheme, effectiveTheme, setSelectedTheme: handleSetSelectedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);