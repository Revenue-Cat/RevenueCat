import React, { useCallback, useMemo } from 'react';
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
  } = useApp();

  const sexKey: SexKey = gender === "lady" ? "w" : "m";

  // Use custom hooks for navigation and scroll handling
  const { currentView, handleHeaderGesture, changeView } = useHomeNavigation();
  const {
    isAchievementsCollapsed,
    scrollY,
    handleScroll,
    toggleAchievements,
    backgroundHeight,
    scrollViewTransform,
    buddyTransform
  } = useHomeScroll();

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

  return (
    <View className="flex-1 bg-[#1F1943]">
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
          <Animated.View className="absolute top-0 left-0 right-0 z-[60] items-center justify-end" style={{ height: 360 }}>
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

          {/* Scrollable Content */}
          <Animated.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ 
              flex: 1, 
              marginTop: 270, 
              zIndex: 1000,
              transform: scrollViewTransform
            }}
          >
            {/* Achievement Cards - Only show for Home view */}
            {currentView === 'home' && (
              <AchievementSection
                isCollapsed={isAchievementsCollapsed}
                onToggle={toggleAchievements}
              />
            )}

            {/* Spacer for Achievement Cards - Only for Home view */}
            {currentView === 'home' && (
              <View style={{ height: isAchievementsCollapsed ? 200 : 400 }} />
            )}

            {/* Content with Carousel */}
            <HomeContent
              currentView={currentView}
              isAchievementsCollapsed={isAchievementsCollapsed}
              onShowCravingSOS={handleShowCravingSOS}
              onNavigateToShop={handleNavigateToShop}
            />
          </Animated.ScrollView>
        </View>
      </PanGestureHandler>
    </View>
  );
};

export default React.memo(Home);