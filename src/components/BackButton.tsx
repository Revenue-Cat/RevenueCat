import React from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

interface BackButtonProps {
  onPress: () => void;
  hitSlop?: number;
  variant?: "arrow" | "icon";
  style?: any;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onPress, 
  hitSlop = 10, 
  variant = "arrow",
  style 
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const buttonStyle = style || `w-10 h-10 rounded-full justify-center items-center ${
    isDark ? "bg-slate-600" : "bg-slate-100"
  }`;

  return (
    <Pressable
      onPress={onPress}
      className={buttonStyle}
      hitSlop={hitSlop}
    >
      {variant === "icon" ? (
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={isDark ? "#e2e8f0" : "#1e1b4b"} 
        />
      ) : (
        <Text
          className={`${
            isDark ? "text-slate-200" : "text-indigo-900"
          } text-lg`}
        >
          ←
        </Text>
      )}
    </Pressable>
  );
};

export default BackButton;
