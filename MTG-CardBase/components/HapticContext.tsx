import React, { createContext, useContext, useState } from 'react';
import * as Haptics from 'expo-haptics';

const HapticContext = createContext();

export const useHaptics = () => useContext(HapticContext);

export const HapticProvider = ({ children }) => {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const toggleHaptics = () => {
    setHapticsEnabled((prev) => {
      const newValue = !prev;
      if (newValue) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      return newValue;
    });
  };

  return (
    <HapticContext.Provider value={{ hapticsEnabled, toggleHaptics }}>
      {children}
    </HapticContext.Provider>
  );
};