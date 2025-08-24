import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Animated,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useApp } from '../contexts/AppContext';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import ParallaxBackground from '../components/ParallaxBackground';
import HomeHeader from '../components/HomeHeader';
import HomeContent from '../components/HomeContent';
import AchievementSection from '../components/AchievementSection';
import AchievementsToggle from '../components/AchievementsToggle';
import { useHomeNavigation } from '../hooks/useHomeNavigation';
import { useHomeScroll } from '../hooks/useHomeScroll';

interface HomeProps {
  onShowCravingSOS: () => void;
  onShowBreathingExercise: () => void;
  onShowChatAssistance: () => void;
  onNavigateToProfile: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToShop: () => void;
}



const Home: React.FC<HomeProps> = ({
  onShowCravingSOS,
  onShowBreathingExercise,
  onShowChatAssistance,
  onNavigateToProfile,
  onNavigateToAchievements,
  onNavigateToShop,
}) => {
  const {
    userCoins,
    setShowCoinPurchase,
    selectedBuddyId,
    gender,
    startDate,
  } = useApp();

  const sexKey: SexKey = gender === "lady" ? "w" : "m";

  // Add state for achievements toggle
  const [isExclusiveSelected, setIsExclusiveSelected] = useState(false);

  // Use custom hooks for navigation and scroll handling
  const { currentView, handleHeaderGesture, changeView } = useHomeNavigation();
  const {
    isAchievementsCollapsed,
    scrollY,
    handleScroll,
    toggleAchievements,
    backgroundHeight,
    scrollViewTransform,
    buddyTransform,
    isInitialized
  } = useHomeScroll();

  // Calculate dynamic ScrollView height based on scroll position
  const scrollViewHeight = useMemo(() => {
    if (currentView === 'home') {
      return scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: ['60%', '70%'], // Fixed pixel values for home view
        extrapolate: 'clamp'
      });
    } else {
      return scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: ['55%', '60%'], // Height increases// Fixed pixel values for other views
        extrapolate: 'clamp'
      });
    }
  }, [scrollY, currentView]);

  // Memoize the buddy image source to prevent recreation
  const buddyImageSource = useMemo(() => 
    buddyAssets[selectedBuddyId as BuddyKey][sexKey], 
    [selectedBuddyId, sexKey]
  );

  // Memoize the coin purchase callback
  const handleCoinPurchase = useCallback(() => {
    setShowCoinPurchase(true);
  }, [setShowCoinPurchase]);

  // Memoize the navigation callbacks
  const handleNavigateToProfile = useCallback(() => {
    onNavigateToProfile();
  }, [onNavigateToProfile]);

  const handleNavigateToShop = useCallback(() => {
    onNavigateToShop();
  }, [onNavigateToShop]);

  const handleShowCravingSOS = useCallback(() => {
    onShowCravingSOS();
  }, [onShowCravingSOS]);

  // Memoize the achievements toggle callback
  const handleSetIsExclusiveSelected = useCallback((isExclusive: boolean) => {
    setIsExclusiveSelected(isExclusive);
  }, []);
  
  // Don't render until scroll position is loaded
  if (!isInitialized) {
    return (
      <View className="flex-1 bg-[#1F1943]">
        {/* Loading state */}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1F1943] absolute inset-0">
      {/* Full Screen PanGestureHandler for left/right navigation */}
      <PanGestureHandler onHandlerStateChange={handleHeaderGesture}>
        <View className="absolute top-0 left-0 right-0 bottom-0 z-[1000]">
          {/* Shrinking ParallaxBackground - shrinks when scrolling achievements */}
          <Animated.View style={{ height: backgroundHeight }}>
            <ParallaxBackground scrollY={scrollY} height={330} />
          </Animated.View>

          {/* Fixed Header - On top of ParallaxBackground */}
          <HomeHeader
            currentView={currentView}
            userCoins={userCoins}
            onNavigateToProfile={handleNavigateToProfile}
            onCoinPurchase={handleCoinPurchase}
            onViewChange={changeView}
          />

          {/* Fixed Buddy Icon - On top of ParallaxBackground */}
          <Animated.View className="absolute top-0 left-0 right-0 z-[50] items-center justify-end" style={{ height: 360 }}>
            <Animated.Image
              source={buddyImageSource}
              style={{ 
                width: 100, 
                height: 220,
                transform: buddyTransform
              }}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Achievements Toggle - On top of Buddy Icon */}
          {currentView === 'achievements' && (
            <AchievementsToggle
              scrollY={scrollY}
              isExclusiveSelected={isExclusiveSelected}
              setIsExclusiveSelected={handleSetIsExclusiveSelected}
            />
          )}

          {/* Scrollable Content */}
          <Animated.ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ 
                flexGrow: 1,
              }}
            style={{ 
                position: 'absolute',
                top: currentView === 'home' ? 320 : 360,
                left: 0,
                right: 0,
                height: scrollViewHeight,
                zIndex: 1000,
                transform: currentView === 'home' ? scrollViewTransform : [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [-70, 0, 100],
                      outputRange: [40, 0, -60],
                      extrapolate: 'clamp'
                    })
                  }
                ],
        
              }}
          >
            {/* Achievement Cards - Dynamic height */}
            {currentView === 'home' && (
              <View style={{ 
                marginTop: 0, 
                backgroundColor: "#1F1943"
              }}>
                <AchievementSection
                  isCollapsed={isAchievementsCollapsed}
                  onToggle={toggleAchievements}
                />
              </View>
            )}
            
            {/* Content with Carousel */}
            <HomeContent
              currentView={currentView}
              isAchievementsCollapsed={isAchievementsCollapsed}
              isExclusiveSelected={isExclusiveSelected}
              onShowCravingSOS={handleShowCravingSOS}
              onNavigateToShop={handleNavigateToShop}
            />
          </Animated.ScrollView>
        </View>
      </PanGestureHandler>
    </View>
  );
};

export default Home;