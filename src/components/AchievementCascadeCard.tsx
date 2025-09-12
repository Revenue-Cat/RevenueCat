import React, { useState, useCallback } from "react";
import { View, Text, LayoutChangeEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type CascadeVariant = "medium" | "small";

interface AchievementCascadeCardProps {
  title: string;
  description: string;
  reward: number;
  timeLeft: string;
  emoji: string;
  variant: CascadeVariant;
  containerClassName?: string;
  overlapRatio?: number; // 0.0 - 1.0, how much of its own height to overlap upwards
}

const AchievementCascadeCard: React.FC<AchievementCascadeCardProps> = ({
  title,
  description,
  reward,
  timeLeft,
  emoji,
  variant,
  containerClassName = "",
  overlapRatio = 0,
}) => {
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setMeasuredHeight(e.nativeEvent.layout.height);
  }, []);

  const isMedium = variant === "medium";

  const container = isMedium
    ? "bg-white/90 rounded-xl p-3 mb-2 flex-row items-center shadow-md"
    : "bg-white/80 rounded-lg p-2 flex-row items-center shadow-sm";

  const rewardPill = isMedium
    ? "flex-row items-center bg-orange-100 px-2 py-1 rounded-full self-start mb-1 gap-1"
    : "flex-row items-center bg-orange-100 px-2 py-0.5 rounded-full self-start mb-1 gap-1";

  const starSize = isMedium ? 10 : 8;
  const timeText = "text-sm text-gray-500 mb-1";
  const titleText = isMedium
    ? "text-xl font-bold text-black mb-1"
    : "text-lg font-bold text-black mb-1";
  const descText = isMedium
    ? "text-md text-gray-500 leading-4"
    : "text-sm text-gray-500 leading-3";

  const badgeSize = isMedium ? "w-12 h-12" : "w-10 h-10";
  const emojiSize = isMedium ? "text-lg" : "text-base";

  const overlapStyle =
    overlapRatio > 0 && measuredHeight > 0
      ? { marginTop: -measuredHeight * overlapRatio }
      : undefined;

  return (
    <View
      className={`${container} ${containerClassName}`}
      style={overlapStyle}
      onLayout={handleLayout}
    >
      <View className="flex-1 mr-2">
        <View className={rewardPill}>
          <Ionicons name="star" size={starSize} color="#FF6B35" />
          <Text className="text-s font-bold text-orange-500">+{reward}</Text>
        </View>
        <Text className={timeText}>{timeLeft}</Text>
        <Text className={titleText}>{title}</Text>
        <Text className={descText} numberOfLines={1}>
          {description}
        </Text>
      </View>
      <View className={`${badgeSize} rounded-full overflow-hidden`}>
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          className="w-full h-full justify-center items-center relative"
        >
          <Text className={`${emojiSize} z-10`}>{emoji}</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default AchievementCascadeCard;
