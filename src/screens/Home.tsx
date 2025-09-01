import React, { useCallback, useMemo, useState } from "react";
import { View, Animated, Pressable, Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { useApp } from "../contexts/AppContext";
import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";
import ParallaxBackground from "../components/ParallaxBackground";
import HomeHeader from "../components/HomeHeader";
import HomeContent from "../components/HomeContent";
import AchievementSection from "../components/AchievementSection";
import AchievementsToggle from "../components/AchievementsToggle";
import ShopToggle from "../components/ShopToggle";
import { useHomeNavigation } from "../hooks/useHomeNavigation";
import { useHomeScroll } from "../hooks/useHomeScroll";
import CoinPurchaseModal from "../components/CoinPurchaseModal";

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
    showCoinPurchase,
    setShowCoinPurchase,
    selectedBuddyId,
    selectedBackground,
    gender,
    startDate,
  } = useApp();

  const sexKey: SexKey = gender === "lady" ? "w" : "m";

  // Add state for achievements toggle
  const [isExclusiveSelected, setIsExclusiveSelected] = useState(false);

  // Add state for shop toggle
  const [isScenesSelected, setIsScenesSelected] = useState(false);

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
    isInitialized,
  } = useHomeScroll();

  // Calculate dynamic ScrollView height based on scroll position
  const scrollViewHeight = useMemo(() => {
    if (currentView === "home") {
      return scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: ["60%", "70%"],
        extrapolate: "clamp",
      });
    } else {
      return scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: ["55%", "60%"],
        extrapolate: "clamp",
      });
    }
  }, [scrollY, currentView]);

  const buddyAnimSource = useMemo(() => {
    const id = selectedBuddyId as string;
    const base: BuddyKey = id.split("-")[0] as BuddyKey;
    const pack = (buddyAssets as any)?.[base];
    return pack?.[sexKey] ?? pack?.m;
  }, [selectedBuddyId, sexKey]);

  const parseGradient = useCallback(
    (gradientString: string): [string, string] => {
      const colorMatch = gradientString.match(/#[A-Fa-f0-9]{6}/g);
      if (colorMatch && colorMatch.length >= 2) {
        return [colorMatch[0], colorMatch[1]];
      }
      const fallbackMatch = gradientString.match(/#[A-Fa-f0-9]{3,6}/g);
      if (fallbackMatch && fallbackMatch.length >= 2) {
        return [fallbackMatch[0], fallbackMatch[1]];
      }
      return ["#1F1943", "#4E3EA9"]; // Default fallback
    },
    []
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

  // Memoize the shop toggle callback
  const handleSetIsScenesSelected = useCallback((isScenes: boolean) => {
    setIsScenesSelected(isScenes);
  }, []);

  const gradientColors = parseGradient(selectedBackground.backgroundColor);

  return (
    <View
      className="flex-1 absolute inset-0"
      style={{ backgroundColor: gradientColors[0] }}
    >
      {/* Fixed Header */}
      <HomeHeader
        currentView={currentView}
        onNavigateToProfile={handleNavigateToProfile}
        onCoinPurchase={handleCoinPurchase}
        onViewChange={changeView}
      />

      <CoinPurchaseModal></CoinPurchaseModal>

      {/* Horizontal pan for view switching */}
      <PanGestureHandler onHandlerStateChange={handleHeaderGesture}>
        <View className="absolute top-0 left-0 right-0 bottom-0 z-[10]">
          <Animated.View
            style={{ height: backgroundHeight }}
            pointerEvents="none"
          >
            <ParallaxBackground scrollY={scrollY} height={330} />
          </Animated.View>

          {/* Buddy Lottie on top of background */}
          <Animated.View
            className="absolute top-0 left-0 right-0 z-[50] items-center justify-end"
            style={{ height: 360 }}
            pointerEvents="none"
          >
            <Animated.View style={{ transform: buddyTransform }}>
              {buddyAnimSource ? (
                <LottieView
                  key={`home-buddy-${currentView === "home" ? "play" : "stop"}`}
                  source={buddyAnimSource}
                  autoPlay={currentView === "home"}
                  loop={currentView === "home"}
                  {...(currentView === "home" ? {} : ({ progress: 0 } as any))}
                  style={{ width: 160, height: 240 }}
                  resizeMode="contain"
                  enableMergePathsAndroidForKitKatAndAbove
                />
              ) : null}
            </Animated.View>
          </Animated.View>

          {/* Achievements Toggle */}
          {currentView === "achievements" && (
            <AchievementsToggle
              scrollY={scrollY}
              isExclusiveSelected={isExclusiveSelected}
              setIsExclusiveSelected={handleSetIsExclusiveSelected}
            />
          )}

          {/* Shop Toggle */}
          {currentView === "shop" && (
            <ShopToggle
              scrollY={scrollY}
              isScenesSelected={isScenesSelected}
              setIsScenesSelected={handleSetIsScenesSelected}
            />
          )}

          {/* Scrollable Content */}
          <Animated.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{
              position: "absolute",
              top: currentView === "home" ? 320 : 360,
              left: 0,
              right: 0,
              height: scrollViewHeight,
              zIndex: 100,
              transform:
                currentView === "home"
                  ? scrollViewTransform
                  : [
                      {
                        translateY: scrollY.interpolate({
                          inputRange: [-70, 0, 100],
                          outputRange: [40, 0, -60],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
            }}
          >
            {/* Achievement Cards */}
            {currentView === "home" && (
              <View
                style={{ marginTop: 0, backgroundColor: gradientColors[0] }}
              >
                <AchievementSection
                  isCollapsed={isAchievementsCollapsed}
                  onToggle={toggleAchievements}
                />
              </View>
            )}

            {/* Main content */}
            <HomeContent
              currentView={currentView}
              isAchievementsCollapsed={isAchievementsCollapsed}
              isExclusiveSelected={isExclusiveSelected}
              isScenesSelected={isScenesSelected}
              setIsScenesSelected={handleSetIsScenesSelected}
              onNavigateToShop={handleNavigateToShop}
            />
          </Animated.ScrollView>

          {/* Fixed Craving SOS Button at Bottom */}
          {currentView === "home" && (
            <View className="absolute bottom-10 left-0 right-0 z-[200] px-6 pb-8">
              <Pressable 
                className="bg-red-500 rounded-xl py-4 items-center shadow-lg" 
                onPress={handleShowCravingSOS}
                style={{ elevation: 10 }}
              >
                <Text className="text-white text-lg font-bold">Craving SOS</Text>
              </Pressable>
            </View>
          )}
        </View>
      </PanGestureHandler>
    </View>
  );
};

export default Home;
