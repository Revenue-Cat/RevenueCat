import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoinIcon from "../assets/icons/coins.svg";
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface BuddyModalContentProps {
  buddy: any;
  userCoins: number;
}

const BuddyModalContent: React.FC<BuddyModalContentProps> = ({
  buddy,
  userCoins,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  const { ownedBuddies, selectedBuddyId } = useApp();
  const isOwned = ownedBuddies?.includes(buddy.id) || false;
  const isSelected = selectedBuddyId === buddy.id;

  // Helper function to render buddy icon
  const renderBuddyIcon = () => {
    return (
      <View className="w-32 h-32 relative">
        {/* Buddy Icon Background */}
        <View className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full justify-center items-center">
          <Image 
            source={buddy.icon}
            className='w-36 h-36'
            resizeMode="contain"
          />
          
          {/* Status Badges */}
          {isSelected && (
            <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-8 h-8 justify-center items-center">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
          {isOwned && !isSelected && (
            <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-8 h-8 justify-center items-center">
              <Ionicons name="checkmark-circle" size={16} color="white" />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Price Banner */}
      <View className="items-center my-2">
        <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
          <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
            {isOwned ? (isSelected ? t('shop.selected') : t('shop.owned')) : t('shop.balance', { coins: buddy.coin || 0 })}
          </Text>
          {!isOwned && <CoinIcon width={18} height={18} />}
        </View>
      </View>
      <View className="items-center my-4">
        {/* Buddy Title */}
        <Text className={`text-2xl font-bold text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
          {buddy.name}
        </Text>

        {/* Buddy Description */}
        <Text className={`text-sm text-center mb-4 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
          {buddy.description || t('shop.description')}
        </Text>
      </View>
      {/* Card Content */}
      <View className={`gap-4 rounded-3xl p-8 justify-center items-center ${isDark ? 'bg-slate-700/50' : 'bg-indigo-50/50'}`}>
      
        {/* Buddy Icon */}
        <View className="items-center my-8 py-8">
          {renderBuddyIcon()}
        </View>
      </View>
    </>
  );
};

export default BuddyModalContent;
