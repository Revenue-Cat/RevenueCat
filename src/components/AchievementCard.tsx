import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface AchievementCardProps {
  title: string;
  description: string;
  reward: number;
  timeLeft: string;
  emoji: string;
  containerClassName?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  reward,
  timeLeft,
  emoji,
  containerClassName = '',
}) => {
  return (
    <View className={`bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-lg ${containerClassName}`}>
      <View className="flex-1 mr-4">
        <View className="flex-row items-center bg-orange-100 px-3 py-1.5 rounded-full self-start mb-1 gap-1">
          <Ionicons name="star" size={12} color="#FF6B35" />
          <Text className="text-xs font-bold text-orange-500">+{reward}</Text>
        </View>
        <Text className="text-xs text-gray-500 mb-2">{timeLeft}</Text>
        <Text className="text-base font-bold text-black mb-1">{title}</Text>
        <Text className="text-sm text-gray-500 leading-5">{description}</Text>
      </View>
      <View className="w-15 h-15 rounded-full overflow-hidden">
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          className="w-full h-full justify-center items-center relative"
        >
          <Text className="text-2xl z-10">{emoji}</Text>
          <View className="absolute inset-0 justify-center items-center">
            <Text className="text-xs absolute text-white">✨</Text>
            <Text className="text-xs absolute text-white">✨</Text>
            <Text className="text-xs absolute text-white">✨</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default AchievementCard;
