import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SlideModal from './SlideModal';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ChallengeCardProps } from './ChallengeCard';
import CoinIcon from "../assets/icons/coins.svg";

interface ChallengeModalProps {
  visible: boolean;
  challenge: ChallengeCardProps | null;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  visible,
  challenge,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();

  if (!challenge) return null;

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      showCloseButton={true}
    >
      <View className="px-2">
        {/* Header: Coins on left, Duration on right */}
        <View className="flex-row justify-between items-center mb-2">
          {/* Coins */}
          <View className="flex-row items-center border border-orange-500 px-3 py-0.5 rounded-full self-start mb-1 gap-1">
            <Text className="text-base font-bold text-orange-500">+{challenge.points}</Text>
            <CoinIcon width={12} height={12} color="#FF6B35" />
          </View>

          {/* Duration */}
          <View className="flex-row items-center pr-2">
            <Text className={`font-semibold text-base ml-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {challenge.duration} Challenge
            </Text>
          </View>
        </View>

        {/* Full-width Icon as Background */}
        <View className="items-center mb-6">
          <View 
            className=" rounded-2xl overflow-hidden relative"
            style={{ width: '100%', height: 280 }}
          >
            {challenge.cardIcon ? (
                <View className="w-full h-full items-center justify-center">
                  {challenge.cardIcon}
                </View>
            ) : (
              <View className="w-full h-full items-center justify-center bg-gray-100">
                <Ionicons name="trophy-outline" size={80} color={isDark ? "#64748b" : "#94a3b8"} />
              </View>
            )}
          </View>
        </View>
                 {/* ScrollView for the content */}
         <ScrollView 
           showsVerticalScrollIndicator={false}
           bounces={false}
           style={{ maxHeight: 300 }}
         >
        {/* Challenge Title */}
        <Text className={`text-2xl font-bold text-center ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          {challenge.title}
        </Text>

        {/* Challenge Description */}
        {challenge.description && (
          <Text className={`text-base text-center leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            {challenge.description}
          </Text>
        )}

        {/* Divider Line */}
        <View className={`w-full h-px my-3 ${isDark ? "bg-slate-600" : "bg-slate-300"}`} />

        {/* Benefits Section */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Benefits
          </Text>
          {challenge.motivation && Array.isArray(challenge.motivation) && challenge.motivation.length > 0 && (
            <View className="space-y-2">
              {challenge.motivation.map((benefit: string, index: number) => (
                <View key={index} className="flex-row items-start">
                  <Text className={`text-green-500 mr-2 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`}>
                    •
                  </Text>
                  <Text className={`flex-1 text-sm leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tips from a friend Section */}
        <View className="mb-4">
          <Text className={`text-lg font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Tips from a friend
          </Text>
          {challenge.buddyAdvice && challenge.buddyAdvice.length > 0 && (
            <View className="space-y-2">
              {challenge.buddyAdvice.map((tip, index) => (
                <View key={index} className="flex-row items-start">
                  <Text className={`text-blue-500 mr-2 mt-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                    •
                  </Text>
                  <Text className={`flex-1 text-sm leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        </ScrollView>
      </View>
    </SlideModal>
  );
};

export default ChallengeModal;
