import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import { calculateSavings, getAvoidedLabel } from '../utils/savingsCalculator';

const HomeStats: React.FC = () => {
  const { t } = useTranslation();
  const { smokeType, dailyAmount, packPrice, packPriceCurrency, daysSmokeFree } = useApp();

  // Calculate savings based on user data
  const savings = calculateSavings(
    smokeType || 'cigarettes',
    dailyAmount || '6-10',
    packPrice || '5',
    packPriceCurrency || '$',
    daysSmokeFree || 30
  );

  // Calculate time saved (assuming 5 minutes per cigarette/stick)
  const timeSavedMinutes = savings.itemsAvoided * 5;
  const timeSavedHours = Math.floor(timeSavedMinutes / 60);
  const timeSavedMinutesRemaining = timeSavedMinutes % 60;

  // Format time display
  const formatTime = () => {
    if (timeSavedHours > 0) {
      return `${timeSavedHours}h${timeSavedMinutesRemaining > 0 ? ` ${timeSavedMinutesRemaining}m` : ''}`;
    }
    return `${timeSavedMinutes}m`;
  };

  return (
    <>
      <View className="flex-row gap-1 mb-1">
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">{savings.itemsAvoided}</Text>
          <Text className="text-xs font-medium text-white">{getAvoidedLabel(smokeType || 'cigarettes')}</Text>
        </View>
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">{packPriceCurrency || '$'}{Math.round(savings.moneySaved)}</Text>
          <Text className="text-xs font-medium text-white">{t('home.stats.moneySaved')}</Text>
        </View>
      </View>
      <View className="flex-row gap-1 mb-6">
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">{formatTime()}</Text>
          <Text className="text-xs font-medium text-white">{t('home.stats.timeSaved')}</Text>
        </View>
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">{daysSmokeFree || 0}</Text>
          <Text className="text-xs font-medium text-white">{t('home.stats.smokeFreeDays')}</Text>
        </View>
      </View>
    </>
  );
};

export default HomeStats;
