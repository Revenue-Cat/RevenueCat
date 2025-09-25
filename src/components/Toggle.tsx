import React from 'react';
import { Pressable, View, Animated } from 'react-native';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor?: {
    false: string;
    true: string;
  };
}

const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  trackColor = {
    false: '#CBD5E1',
    true: '#3B82F6',
  },
  thumbColor = {
    false: '#FFFFFF',
    true: '#FFFFFF',
  },
}) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          track: { width: 40, height: 20 },
          thumb: { width: 16, height: 16 },
        };
      case 'lg':
        return {
          track: { width: 56, height: 28 },
          thumb: { width: 24, height: 24 },
        };
      default: // md
        return {
          track: { width: 48, height: 24 },
          thumb: { width: 20, height: 20 },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const trackBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [trackColor.false, trackColor.true],
  });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, sizeStyles.track.width - sizeStyles.thumb.width - 4],
  });

  const thumbBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [thumbColor.false, thumbColor.true],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={{
          width: sizeStyles.track.width,
          height: sizeStyles.track.height,
          borderRadius: sizeStyles.track.height / 2,
          backgroundColor: trackBackgroundColor,
          justifyContent: 'center',
          padding: 2,

        }}
      >
        <Animated.View
          style={{
            width: sizeStyles.thumb.width,
            height: sizeStyles.thumb.height,
            borderRadius: sizeStyles.thumb.height / 2,
            backgroundColor: thumbBackgroundColor,
            transform: [{ translateX: thumbTranslateX }],
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

export default Toggle;
