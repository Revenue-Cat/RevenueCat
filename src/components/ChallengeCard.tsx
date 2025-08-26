import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export type ChallengeStatus = 'active' | 'locked';

export interface ChallengeCardProps {
  title: string;
  description?: string;
  points: number;
  duration: string; // e.g., "10 Days"
  imageUrl?: string;
  icon?: any;
  status: ChallengeStatus;
  progress?: number; // 0-100
  streak?: number; // e.g., 4
  checkIns?: number; // e.g., 5
  onCheckIn?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  points,
  duration,
  imageUrl,
  icon,
  status,
  progress = 0,
  streak,
  checkIns,
  onCheckIn,
}) => {
  const { t } = useTranslation();
  const isLocked = status === 'locked';
  const showProgress = !isLocked && typeof progress === 'number';

  return (
    <View className="bg-white rounded-2xl p-4 mb-4">
      {/* Main Content */}
      <View className="flex-row justify-between items-start mb-3">
        {/* Left: points badge + duration + title + description */}
        <View className="flex-1 mr-3">
          <View className="self-start flex-row items-center bg-orange-50 border border-orange-300 px-2 py-1 rounded-full mb-2">
            <Ionicons name="star" size={14} color="#F97316" />
            <Text className="text-orange-500 font-semibold text-xs ml-1">+{points}</Text>
          </View>
          <Text className="text-gray-500 text-xs mb-2">{duration} {t('challenges.challenge')}</Text>
          
          {/* Title and Description */}
          <Text className="text-lg font-bold text-black mb-1">{title}</Text>
          {!!description && (
            <Text className="text-gray-600 text-sm">{description}</Text>
          )}
        </View>

        {/* Right: Thumbnail with overlays */}
        <View className="w-25 h-25 rounded-xl overflow-hidden relative">
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            icon ? icon : <View className="w-full h-full bg-gray-200" />
          )}
          {/* Overlay: streak or lock */}
          {isLocked ? (
            <View className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 items-center justify-center">
              <Ionicons name="lock-closed" size={14} color="#ffffff" />
            </View>
          ) : typeof streak === 'number' && streak > 0 ? (
            <View className="absolute top-1.5 right-1.5 min-w-6 h-6 px-1 rounded-full bg-green-500 items-center justify-center">
              <Text className="text-white text-xs font-bold">{streak}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Actions (only for active) */}
      {!isLocked && (
        <View>
          {/* Progress */}
          {showProgress && (
            <View className="mb-3">
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} className="h-full bg-green-500" />
              </View>
              {/* <Text className="text-xs text-gray-500 mt-1">{progress}% complete</Text> */}
            </View>
          )}

          {/* Check In Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onCheckIn}
            className="bg-indigo-600 rounded-2xl p-3 flex-row items-center justify-center"
          >
            <Ionicons name="checkmark" size={18} color="#ffffff" />
            <Text className="text-white font-semibold text-base ml-2">{t('challenges.checkIn')}</Text>
            {typeof checkIns === 'number' && (
              <View className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
                <Text className="text-white text-xs font-bold">{checkIns}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default React.memo(ChallengeCard);
