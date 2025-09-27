import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

interface SetupFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value?: string;
  disabled?: boolean;
  showCheckmark?: boolean;
  onPress: () => void;
  className?: string;
  rightContent?: React.ReactNode;
}

const SetupField: React.FC<SetupFieldProps> = ({
  id,
  label,
  icon,
  value,
  disabled = false,
  showCheckmark = false,
  onPress,
  className = "",
  rightContent,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Pressable
      className={`h-14 rounded-2xl px-4 flex-row items-center justify-between ${
        disabled
          ? isDark
            ? "bg-slate-800 opacity-50"
            : "bg-slate-200 opacity-50"
          : isDark
          ? "bg-slate-700"
          : "bg-indigo-50"
      } ${className || "w-full"}`}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="flex-row items-center flex-1">
        {icon}
        <Text
          className={`ml-3 flex-1 ${
            disabled
              ? isDark
                ? "text-slate-400"
                : "text-slate-500"
              : isDark
              ? "text-slate-100"
              : "text-indigo-950"
          }`}
          style={{ fontWeight: "600" }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value || label}
        </Text>
      </View>
      {rightContent || (
        <Ionicons
          name={
            showCheckmark ? "checkmark" : "chevron-forward-outline"
          }
          size={showCheckmark ? 18 : 20}
          color={
            disabled
              ? isDark
                ? "#64748b"
                : "#94a3b8"
              : isDark
              ? "#CBD5E1"
              : "#64748b"
          }
        />
      )}
    </Pressable>
  );
};

export default SetupField;
