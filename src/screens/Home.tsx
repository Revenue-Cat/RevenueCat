import React, { useCallback, useMemo, useState } from "react";
import { View, Animated, Pressable, Text, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import CoinIcon from "../assets/icons/coins.svg";
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
import CTAButton from "../components/CTAButton";
import { t } from "i18next";

interface HomeProps {
  onShowCravingSOS: () => void;
  onShowBreathingExercise: () => void;
  onShowChatAssistance: () => void;
  onNavigateToProfile: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToProgressChallenges: () => void;
  onNavigateToShop: () => void;
}

const Home: React.FC<HomeProps> = ({
  onShowCravingSOS,
  onShowBreathingExercise,
  onShowChatAssistance,
  onNavigateToProfile,
  onNavigateToAchievements,
  onNavigateToProgressChallenges,
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
  const { currentView, handleHeaderGesture, changeView, onHeaderGestureEvent, contentTranslateX } = useHomeNavigation();
  const { width } = Dimensions.get("window");
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
  // const scrollViewHeight = useMemo(() => {
  //   if (currentView === "home") {
  //     return scrollY.interpolate({
  //       inputRange: [0, 100],
  //       outputRange: ["60%", "70%"],
  //       extrapolate: "clamp",
  //     });
  //   } else {
  //     return scrollY.interpolate({
  //       inputRange: [0, 100],
  //       outputRange: ["55%", "60%"],
  //       extrapolate: "clamp",
  //     });
  //   }
  // }, [scrollY, currentView]);

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

  const handleNavigateToProgressChallenges = useCallback(() => {
    onNavigateToProgressChallenges();
  }, [onNavigateToProgressChallenges]);

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
      <CoinPurchaseModal></CoinPurchaseModal>

      {/* Horizontal pan for view switching */}
      <PanGestureHandler onGestureEvent={onHeaderGestureEvent} onHandlerStateChange={handleHeaderGesture}>
        <View className="absolute top-0 left-0 right-0 bottom-0 z-[10]">
          {/* Fixed Buddy Icon and User Coins - outside of swipe animation */}
          <View className="absolute top-10 left-0 right-0 p-6 z-[60]" pointerEvents="box-none">
            <View className="flex-row justify-between items-start">
              {/* Buddy Icon - Fixed */}
              <Pressable
                className="w-[60px] mt-2.5 p-0.3"
                onPress={handleNavigateToProfile}
              >
                <Pressable
                  className="w-7 h-7 rounded-full bg-black/50 justify-center items-center overflow-hidden"
                  onPress={handleNavigateToProfile}
                  style={{ position: "relative", transform: [{ translateY: -8 }] }}
                >
                  {buddyAnimSource ? (
                    <LottieView
                      source={buddyAnimSource}
                      autoPlay={false}
                      loop={false}
                      progress={0.4}
                      style={{
                        width: 56,
                        height: 56,
                        transform: [{ translateY: 10 }, { scale: 0.8 }],
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons name="person-outline" size={16} color="#ffffff" />
                  )}
                </Pressable>
              </Pressable>

              {/* Spacer for center content */}
              <View className="flex-1" />

              {/* User Coins - Fixed */}
              <Pressable
                className="flex-row items-center bg-black/50 w-[60px] h-7 rounded-3xl py-1 px-2 gap-1.5"
                onPress={handleCoinPurchase}
              >
                <Text className="text-base font-semibold text-amber-500 leading-6">
                  {userCoins}
                </Text>
                <CoinIcon width={16} height={16} />
              </Pressable>
            </View>
          </View>

          <Animated.View
            style={{ height: backgroundHeight }}
            pointerEvents="none"
          >
            <ParallaxBackground scrollY={scrollY} height={330} />
          </Animated.View>

          {/* Buddy Lottie on top of background */}
          <Animated.View
            className="absolute top-0 left-0 right-0 items-center justify-end"
            style={{ height: 360, zIndex: 30 }}
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

          {/* Toggles Container - 3 horizontal pages */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              width: width * 3,
              flexDirection: "row",
              transform: [{ translateX: contentTranslateX }],
            }}
          >
            {/* Achievements Page - Header + Toggle */}
            <View style={{ width }}>
              <HomeHeader
                currentView="achievements"
                onNavigateToProfile={handleNavigateToProfile}
                onCoinPurchase={handleCoinPurchase}
                onViewChange={changeView}
                scrollY={scrollY}
              />
             
            </View>

            {/* Home Page - Header only */}
            <View style={{ width }}>
              <HomeHeader
                currentView="home"
                onNavigateToProfile={handleNavigateToProfile}
                onCoinPurchase={handleCoinPurchase}
                onViewChange={changeView}
                scrollY={scrollY}
              />
            </View>

            {/* Shop Page - Header + Toggle */}
            <View style={{ width }}>
              <HomeHeader
                currentView="shop"
                onNavigateToProfile={handleNavigateToProfile}
                onCoinPurchase={handleCoinPurchase}
                onViewChange={changeView}
                scrollY={scrollY}
              />
             
            </View>
          </Animated.View>
           {/* Toggles Container - 3 horizontal pages */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              width: width * 3,
              flexDirection: "row",
              transform: [{ translateX: contentTranslateX }],
            }}
          >
            {/* Achievements Page - Header + Toggle */}
            <View style={{ width }}>
              <AchievementsToggle
                scrollY={scrollY}
                isExclusiveSelected={isExclusiveSelected}
                setIsExclusiveSelected={handleSetIsExclusiveSelected}
              />
            </View>

            {/* Home Page - Header only */}
            <View style={{ width }} />
              
            {/* Shop Page - Header + Toggle */}
            <View style={{ width }}>
          
              <ShopToggle
                scrollY={scrollY}
                isScenesSelected={isScenesSelected}
                setIsScenesSelected={handleSetIsScenesSelected}
              />
            </View>
          </Animated.View>

          {/* Scrollable Content - 3 horizontal pages, each vertically scrollable */}
          <Animated.View
            style={{
              position: "absolute",
              top: 360,
              left: 0,
              right: 0,
              height: "55%",
              zIndex: 100,
              width: width * 3,
              flexDirection: "row",
              transform: [
                { translateX: contentTranslateX },
                ...scrollViewTransform,
              ],
            }}
          >
            {/* Achievements Page */}
            <Animated.ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={currentView === "achievements"}
              style={{ width }}
            >
              <HomeContent
                currentView={"achievements" as any}
                isAchievementsCollapsed={isAchievementsCollapsed}
                isExclusiveSelected={isExclusiveSelected}
                isScenesSelected={isScenesSelected}
                setIsScenesSelected={handleSetIsScenesSelected}
                onNavigateToShop={handleNavigateToShop}
              />
            </Animated.ScrollView>

            {/* Home Page */}
            <Animated.ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={currentView === "home"}
              style={{ width, marginTop: -60, }}
            >
              <AchievementSection
                isCollapsed={isAchievementsCollapsed}
                onToggle={toggleAchievements}
                onNavigateToProgressChallenges={handleNavigateToProgressChallenges}
              />

              <HomeContent
                currentView={"home" as any}
                isAchievementsCollapsed={isAchievementsCollapsed}
                isExclusiveSelected={isExclusiveSelected}
                isScenesSelected={isScenesSelected}
                setIsScenesSelected={handleSetIsScenesSelected}
                onNavigateToShop={handleNavigateToShop}
              />
              <CTAButton
                label={t("home.cravingSOS", "Craving SOS")}
                onPress={handleShowCravingSOS}
                tone="danger"
                rightIconName={null}
                containerClassName="absolute bottom-0 left-0 right-0 z-[200]"
              />
            </Animated.ScrollView>

            {/* Shop Page */}
            <Animated.ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={currentView === "shop"}
              style={{ width }}
            >
              <HomeContent
                currentView={"shop" as any}
                isAchievementsCollapsed={isAchievementsCollapsed}
                isExclusiveSelected={isExclusiveSelected}
                isScenesSelected={isScenesSelected}
                setIsScenesSelected={handleSetIsScenesSelected}
                onNavigateToShop={handleNavigateToShop}
              />
            </Animated.ScrollView>
          </Animated.View>

          {/* {currentView === "home" && (
            <CTAButton
              label={t("home.cravingSOS", "Craving SOS")}
              onPress={handleShowCravingSOS}
              tone="danger"
              rightIconName={null}
              containerClassName="absolute bottom-10 left-0 right-0 z-[200] px-6 pb-8"
            />
          )} */}
        </View>
      </PanGestureHandler>
    </View>
  );
};

export default Home;