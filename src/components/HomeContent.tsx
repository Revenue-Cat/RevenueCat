import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
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
  onNavigateToShop: () => void;
  onNavigateToBreathing?: () => void;
}

const HomeContent: React.FC<HomeContentProps> = ({
  currentView,
  isAchievementsCollapsed,
  isExclusiveSelected,
  isScenesSelected,
  setIsScenesSelected,
  onNavigateToShop,
  onNavigateToBreathing
}) => {
  const { t } = useTranslation();
  const { selectedBackground } = useApp();
  
  // Helper function to parse gradient string and return colors
  const parseGradient = (gradientString: string): [string, string] => {
    // Extract colors from linear-gradient string
    const colorMatch = gradientString.match(/#[A-Fa-f0-9]{6}/g);
    if (colorMatch && colorMatch.length >= 2) {
      return [colorMatch[0], colorMatch[1]]; // Return first two colors
    }
    return ['#1F1943', '#4E3EA9']; // Default fallback
  };
  
  
  const gradientColors = parseGradient(selectedBackground.backgroundColor);
  
  return (
    <View style={{ paddingHorizontal: 24, backgroundColor: "transparent"  }}>
      {/* Conditional Content Based on View */}
      {currentView === 'home' && (
        <>
          {/* Stats */}
          <HomeStats />
          <Challenges onNavigateToBreathing={onNavigateToBreathing} />
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
