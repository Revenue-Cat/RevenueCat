import React from 'react';
import { View, Text, Pressable } from 'react-native';
import HomeStats from './HomeStats';
import Challenges from '../screens/Challenges';
import Achievements from '../screens/Achievements';

interface HomeContentProps {
  currentView: 'home' | 'achievements' | 'shop';
  isAchievementsCollapsed: boolean;
  onShowCravingSOS: () => void;
  onNavigateToShop: () => void;
}

const HomeContent: React.FC<HomeContentProps> = ({
  currentView,
  isAchievementsCollapsed,
  onShowCravingSOS,
  onNavigateToShop
}) => {
  return (
    <View style={{ paddingHorizontal: 24, backgroundColor: "#1F1943" }}>
      {/* Conditional Content Based on View */}
      {currentView === 'home' && (
        <>
          {/* Stats */}
          <HomeStats />
          <Challenges />

          {/* Craving SOS Button */}
          <Pressable className="bg-red-500 rounded-xl py-4 items-center" onPress={onShowCravingSOS}>
            <Text className="text-white text-lg font-bold">Craving SOS</Text>
          </Pressable>
        </>
      )}

      {currentView === 'achievements' && (
        <Achievements onBack={() => {}} />
      )}

      {currentView === 'shop' && (
        <View className="items-center py-8">
          <Text className="text-white text-lg mb-4">Shop Preview</Text>
          <Pressable 
            className="bg-green-500 rounded-xl px-6 py-3"
            onPress={onNavigateToShop}
          >
            <Text className="text-white font-bold">Open Shop</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default HomeContent;
