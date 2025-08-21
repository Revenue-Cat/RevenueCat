import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Timer from './Timer';

interface HomeHeaderProps {
  currentView: 'home' | 'achievements' | 'shop';
  userCoins: number;
  onNavigateToProfile: () => void;
  onCoinPurchase: () => void;
  onViewChange: (view: 'home' | 'achievements' | 'shop') => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  currentView,
  userCoins,
  onNavigateToProfile,
  onCoinPurchase,
  onViewChange
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'home': return 'Zero Poofs';
      case 'achievements': return 'Achievements';
      case 'shop': return 'Shop';
      default: return 'Zero Poofs';
    }
  };

  return (
    <View className="absolute top-0 left-0 right-0 p-6" style={{ height: 140 }}>
      <View className="flex-row justify-between items-start mb-8">
        <Pressable 
          className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
          onPress={onNavigateToProfile}
        >
          <Ionicons name="person-outline" size={24} color="#ffffff" />
        </Pressable>

        {/* Carousel Header */}
        <View className="rounded-xl items-center">
          {/* Title */}
          <Text className="text-xl font-bold text-white">
            {getViewTitle()}
          </Text>
          
          {/* Timer Units - Only show for Home view */}
          {currentView === 'home' && <Timer />}

          {/* Preview content for other views */}
          {currentView === 'achievements' && (
            <View className="items-center mt-2">
              <Text className="text-sm text-white opacity-80">Tap to view achievements</Text>
            </View>
          )}

          {currentView === 'shop' && (
            <View className="items-center mt-2">
              <Text className="text-sm text-white opacity-80">Tap to open shop</Text>
            </View>
          )}
        </View>
        
        <Pressable 
          className="flex-row items-center bg-white/20 px-3 py-2 rounded-full gap-2"
          onPress={onCoinPurchase}
        >
          <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
          <Text className="text-base font-bold text-white">{userCoins}</Text>
        </Pressable>
      </View>

      {/* Carousel Navigation Dots - Inside Header Area */}
      <View className="flex-row justify-center mt-4">
        <Pressable 
          className={`w-2 h-2 rounded-full mx-1 ${
            currentView === 'achievements' ? 'bg-white' : 'bg-white/40'
          }`}
          onPress={() => onViewChange('achievements')}
        />
        <Pressable 
          className={`w-2 h-2 rounded-full mx-1 ${
            currentView === 'home' ? 'bg-white' : 'bg-white/40'
          }`}
          onPress={() => onViewChange('home')}
        />
        <Pressable 
          className={`w-2 h-2 rounded-full mx-1 ${
            currentView === 'shop' ? 'bg-white' : 'bg-white/40'
          }`}
          onPress={() => onViewChange('shop')}
        />
      </View>
    </View>
  );
};

export default HomeHeader;
