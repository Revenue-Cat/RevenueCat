// src/components/CTAButton.tsx
import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Tone = "primary" | "danger";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Override the default right icon ("arrow-forward") or pass null to hide */
  rightIconName?: keyof typeof Ionicons.glyphMap | null;
  /** Optional left icon name (Ionicons) */
  leftIconName?: keyof typeof Ionicons.glyphMap;
  /** Extra tailwind classes for outer container (e.g., "pb-4") */
  containerClassName?: string;
  /** Extra tailwind classes for the button element */
  className?: string;
  /** testID to help with E2E */
  testID?: string;
  tone?: Tone;
  icon?: any;
};

const CTAButton: React.FC<Props> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  rightIconName = "arrow-forward",
  leftIconName,
  containerClassName = "",
  className = "",
  testID,
  tone = "primary",
  icon,
}) => {
  const isBlocked = disabled || loading;

  const bgClass = tone === "danger" ? "bg-red-500" : "bg-indigo-600";

  return (
    <View className={`px-6 pb-8 ${containerClassName}`}>
      <Pressable
        accessibilityRole="button"
        testID={testID}
        disabled={isBlocked}
        onPress={onPress}
        className={`rounded-2xl px-6 py-4 items-center justify-center flex-row ${bgClass} ${
          isBlocked ? "opacity-60" : ""
        } ${className}`}
      >
        {leftIconName ? (
          <Ionicons name={leftIconName} size={22} color="#ffffff" />
        ) : null}

        <Text className="font-semibold text-xl text-white mx-2">{label}</Text>

        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : rightIconName ? (
          <Ionicons name={rightIconName} size={24} color="#ffffff" />
        ) : icon ? (
          icon
        ) : null}
      </Pressable>
    </View>
  );
};

export default CTAButton;
