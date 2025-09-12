import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import { calculateSavings, getAvoidedLabel } from '../utils/savingsCalculator';

const HomeStats: React.FC = () => {
  const { t } = useTranslation();
  const { smokeType, dailyAmount, packPrice, packPriceCurrency, daysSmokeFree, startDate, slipsUsed, getSlipsAllowed } = useApp();

  // Calculate actual days since start date
  const getActualDaysSmokeFree = () => {
    if (!startDate) return daysSmokeFree || 0;
    
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const actualDaysSmokeFree = getActualDaysSmokeFree();

  // Calculate slips information
  const allowedSlips = getSlipsAllowed();
  const slipsRemaining = Math.max(allowedSlips - slipsUsed, 0);

  // Calculate savings based on user data
  const savings = calculateSavings(
    smokeType || 'cigarettes',
    dailyAmount || '6-10',
    packPrice || '5',
    packPriceCurrency || '$',
    actualDaysSmokeFree
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
          <Text className="text-s font-medium text-white opacity-50">{getAvoidedLabel(smokeType || 'cigarettes')}</Text>
        </View>
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">{packPriceCurrency || '$'}{Math.round(savings.moneySaved)}</Text>
          <Text className="text-s font-medium text-white opacity-50">{t('home.stats.moneySaved')}</Text>
        </View>
      </View>
      <View className="flex-row gap-1 mb-6">
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">{formatTime()}</Text>
          <Text className="text-s font-medium text-white opacity-50">{t('home.stats.timeSaved')}</Text>
        </View>
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <View className="flex-row items-baseline">
            <Text className="text-2xl font-semibold text-red-400">{slipsUsed}</Text>
            <Text className="text-sm font-bold text-white ml-1 opacity-50">/ {allowedSlips}</Text>
          </View>
          <Text className="text-s font-medium text-white opacity-50">{t('home.stats.slips')}</Text>
        </View>
      </View>
    </>
  );
};

export default HomeStats;
