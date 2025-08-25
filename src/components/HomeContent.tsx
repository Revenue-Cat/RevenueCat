import React from 'react';
import { View, Text, Pressable } from 'react-native';
import HomeStats from './HomeStats';
import Challenges from '../screens/Challenges';
import Achievements from '../screens/Achievements';
import Shop from '../screens/Shop';

interface HomeContentProps {
  currentView: 'home' | 'achievements' | 'shop';
  isAchievementsCollapsed: boolean;
  isExclusiveSelected: boolean;
  isScenesSelected: boolean;
  setIsScenesSelected: (isScenes: boolean) => void;
  onShowCravingSOS: () => void;
  onNavigateToShop: () => void;
}

const HomeContent: React.FC<HomeContentProps> = ({
  currentView,
  isAchievementsCollapsed,
  isExclusiveSelected,
  isScenesSelected,
  setIsScenesSelected,
  onShowCravingSOS,
  onNavigateToShop
}) => {
  console.log("HomeContent render - currentView:", currentView, "isExclusiveSelected:", isExclusiveSelected);
  
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
        <Achievements onBack={() => {}} isExclusiveSelected={isExclusiveSelected} />
      )}

      {currentView === 'shop' && (
        <Shop 
          onBack={() => {}} 
          isScenesSelected={isScenesSelected}
          setIsScenesSelected={setIsScenesSelected}
        />
      )}
    </View>
  );
};

export default HomeContent;
