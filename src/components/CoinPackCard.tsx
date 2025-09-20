// src/components/CoinPackCard.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import CoinIcon from "../assets/icons/coins.svg";
import type { CoinPack } from "../config/subscriptions";

type Props = {
  pack: CoinPack;
  onPress: (pack: CoinPack) => void;
  isSelected?: boolean;
};

const CoinPackCard: React.FC<Props> = ({ pack, onPress, isSelected: showHighlight }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Use isSelected for highlight instead of bonus/featured logic
  showHighlight = !!pack.bonusTag && !!pack.featured;

  return (
    <Pressable
      onPress={() => onPress(pack)}
      className={`rounded-3xl px-5 py-4 mb-3 ${
        isDark ? "bg-gray-700" : "bg-indigo-50"
      } ${showHighlight ? "border-2 border-indigo-600" : "border-0"}`}
    >
      {/* Bonus badge */}
      {showHighlight && (
        <View className="absolute -top-3 left-6 rounded-full px-3 py-1 bg-indigo-600">
          <Text className="text-white font-bold text-s">{pack.bonusTag}</Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        {/* Left */}
        <View>
          <View className="flex-row items-center">
            <Text
              className={`${
                isDark ? "text-slate-100" : "text-indigo-950"
              } font-bold text-[18px]`}
            >
              {pack.label}{" "}
            </Text>
            <Text className="text-amber-500 font-bold text-[18px]">
              +{pack.coins}{" "}
            </Text>
            <CoinIcon width={14} height={14} />
          </View>

          {!!pack.caption && (
            <Text
              className={`mt-1 ${
                isDark ? "text-slate-300" : "text-slate-500"
              } text-[14px]`}
              numberOfLines={1}
            >
              {pack.caption}
            </Text>
          )}
        </View>

        {/* Right */}
        <View className="items-end">
            <Text
              className={`${
                isDark ? "text-slate-100" : "text-indigo-950"
              } font-bold text-[20px]`}
            >
              {pack.price.toFixed(2)} {pack.currency}
            </Text>
          {!!pack.oldPrice && (
            <Text className="mt-1 text-slate-500 line-through text-[14px]">
              {pack.oldPrice.toFixed(1)} {pack.currency}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default CoinPackCard;
