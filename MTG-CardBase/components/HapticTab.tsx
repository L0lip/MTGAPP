import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

interface HapticTabProps extends BottomTabBarButtonProps {
  handleTabPress: () => void;
}

export function HapticTab({ handleTabPress, ...props }: HapticTabProps) {
  return (
    <PlatformPressable
      {...props}
      onPress={(ev) => {
        // Trigger haptic feedback on press (when the button is pressed and released)
        handleTabPress();
        props.onPress?.(ev);
      }}
    />
  );
}