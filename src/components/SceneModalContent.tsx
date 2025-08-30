import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoinIcon from "../assets/icons/coins.svg";
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface SceneModalContentProps {
  scene: any;
  userCoins: number;
}

const SceneModalContent: React.FC<SceneModalContentProps> = ({
  scene,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  const { ownedBackgrounds, selectedBackground, userCoins } = useApp();
  const isOwned = ownedBackgrounds?.includes(scene.id) || false;
  const isSelected = selectedBackground.id === scene.id;

  // Helper function to render scene preview
  const renderScenePreview = () => {
    return (
      <View className="w-full h-full relative rounded-2xl overflow-hidden">
        <Image 
          source={scene.background}
          className='w-full h-full'
          resizeMode="stretch"
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
    );
  };

  return (
    <>
      {/* Price Banner */}
      <View className="items-center my-2">
        <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
          <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
            {isOwned ? (isSelected ? t('shop.selected') : t('shop.owned')) : t('shop.balance', { coins: userCoins || 0 })}
          </Text>
          {!isOwned && <CoinIcon width={18} height={18} />}
        </View>
      </View>
      <View className="items-center my-4">
        {/* Scene Title */}
        <Text className={`text-2xl font-bold text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
          {scene.name}
        </Text>

        {/* Scene Description */}
        <Text className={`text-sm text-center mb-4 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
          {scene.description || t('shop.sceneDescription')}
        </Text>
      </View>
      {/* Card Content */}
      <View className={`h-64 my-4 rounded-3xl justify-center items-center overflow-hidden ${isDark ? 'bg-slate-700/50' : 'bg-indigo-50/50'}`}>
      
        {/* Scene Preview */}
          {renderScenePreview()}
      </View>
    </>
  );
};

export default SceneModalContent;
