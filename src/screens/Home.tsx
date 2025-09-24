import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { View, Animated, Pressable, Text, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import CoinIcon from "../assets/icons/coins.svg";
import { useApp } from "../contexts/AppContext";
import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";
import { getTranslatedBuddyData } from "../data/buddiesData";
import { getTranslatedSceneData } from "../data/scenesData";
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
  onShowBreathingExercise: (skipInitialScreen?: boolean) => void;
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
    ownedBuddies,
    ownedBackgrounds,
    purchaseItem,
  } = useApp();

  const sexKey: SexKey = gender === "lady" ? "w" : "m";

  // Add state for achievements toggle
  const [isExclusiveSelected, setIsExclusiveSelected] = useState(false);

  // Add state for shop toggle
  const [isScenesSelected, setIsScenesSelected] = useState(false);

  // CTA Button animations
  const homeButtonOpacity = useRef(new Animated.Value(0)).current;
  const shopButtonOpacity = useRef(new Animated.Value(0)).current;
  const homeButtonTranslateY = useRef(new Animated.Value(50)).current;
  const shopButtonTranslateY = useRef(new Animated.Value(50)).current;

  // Use custom hooks for navigation and scroll handling
  const { currentView, handleHeaderGesture, changeView, onHeaderGestureEvent, contentTranslateX } = useHomeNavigation();
  const { width, height } = Dimensions.get("window");
  const {
    isAchievementsCollapsed,
    scrollY,
    handleScroll,
    toggleAchievements,
    backgroundHeight,
    backgroundTransform,
    scrollViewTransform,
    buddyTransform,
    isInitialized,
  } = useHomeScroll();

  // Calculate scrollable content height (screen height minus header area)
  const scrollableContentHeight = height - 360; // 360 is the top position


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

  const gradientColors = parseGradient(selectedBackground?.backgroundColor || '');

  // Calculate total cost of all available buddies for current gender
  const totalBuddyCost = useMemo(() => {
    const translatedBuddies = getTranslatedBuddyData(t);
    const genderSpecificBuddies = translatedBuddies.filter(buddy => 
      buddy.id.endsWith(`-${sexKey}`) && !ownedBuddies?.includes(buddy.id)
    );
    return genderSpecificBuddies.reduce((total, buddy) => total + buddy.coin, 0);
  }, [sexKey, ownedBuddies, t]);

  // Calculate total cost of all available scenes
  const totalSceneCost = useMemo(() => {
    const translatedScenes = getTranslatedSceneData(t);
    const availableScenes = translatedScenes.filter(scene => 
      !ownedBackgrounds?.includes(scene.id)
    );
    return availableScenes.reduce((total, scene) => total + (scene.coin ?? 0), 0);
  }, [ownedBackgrounds, t]);

  // Get the appropriate total cost and label based on current shop tab
  const shopTotalCost = useMemo(() => {
    return isScenesSelected ? totalSceneCost : totalBuddyCost;
  }, [isScenesSelected, totalSceneCost, totalBuddyCost]);

  const shopButtonLabel = useMemo(() => {
    const itemType = isScenesSelected ? t('shop.scenes') : t('shop.buddies');
    return t('shop.getAll', { itemType, cost: shopTotalCost });
  }, [isScenesSelected, shopTotalCost, t]);

  // Function to buy all available items (buddies or scenes)
  const handleBuyAllItems = useCallback(async () => {
    if (userCoins < shopTotalCost) {
      setShowCoinPurchase(true);
      return;
    }

    if (isScenesSelected) {
      // Buy all available scenes
      const translatedScenes = getTranslatedSceneData(t);
      const availableScenes = translatedScenes.filter(scene => 
        !ownedBackgrounds?.includes(scene.id)
      );

      for (const scene of availableScenes) {
        try {
          // Convert Scene to ShopItem format for purchaseItem
          const shopItem = {
            id: scene.id,
            emoji: "🎨", // Default emoji for scenes
            name: scene.name,
            price: scene.coin,
            owned: scene.owned,
            coin: scene.coin, // Add coin field for compatibility
          };
          await purchaseItem(shopItem, 'backgrounds');
        } catch (error) {
          console.error(t('shop.purchaseFailed', { item: scene.name }), error);
          break; // Stop if any purchase fails
        }
      }
    } else {
      // Buy all available buddies
      const translatedBuddies = getTranslatedBuddyData(t);
      const genderSpecificBuddies = translatedBuddies.filter(buddy => 
        buddy.id.endsWith(`-${sexKey}`) && !ownedBuddies?.includes(buddy.id)
      );

      for (const buddy of genderSpecificBuddies) {
        try {
          // Convert Buddy to ShopItem format for purchaseItem
          const shopItem = {
            id: buddy.id,
            emoji: buddy.emoji,
            name: buddy.name,
            price: buddy.coin,
            owned: buddy.owned,
            coin: buddy.coin, // Add coin field for compatibility
          };
          await purchaseItem(shopItem, 'buddies');
        } catch (error) {
          console.error(t('shop.purchaseFailed', { item: buddy.name }), error);
          break; // Stop if any purchase fails
        }
      }
    }
  }, [isScenesSelected, userCoins, shopTotalCost, ownedBackgrounds, ownedBuddies, sexKey, purchaseItem, setShowCoinPurchase, t]);


  // Animate CTA buttons based on current view
  useEffect(() => {
    const animationDuration = 300;
    
    if (currentView === "home") {
      // Animate home button in
      Animated.parallel([
        Animated.timing(homeButtonOpacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(homeButtonTranslateY, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        // Animate shop button out
        Animated.timing(shopButtonOpacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(shopButtonTranslateY, {
          toValue: 50,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (currentView === "shop") {
      // Animate shop button in
      Animated.parallel([
        Animated.timing(shopButtonOpacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(shopButtonTranslateY, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        // Animate home button out
        Animated.timing(homeButtonOpacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(homeButtonTranslateY, {
          toValue: 50,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide both buttons for achievements view
      Animated.parallel([
        Animated.timing(homeButtonOpacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(homeButtonTranslateY, {
          toValue: 50,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(shopButtonOpacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(shopButtonTranslateY, {
          toValue: 50,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentView, homeButtonOpacity, shopButtonOpacity, homeButtonTranslateY, shopButtonTranslateY]);

  return (
    <View
      className="flex-1 absolute inset-0"
      style={{ backgroundColor: gradientColors[0] }}
    >
      <CoinPurchaseModal></CoinPurchaseModal>

      {/* Horizontal pan for view switching */}
      <PanGestureHandler 
        onGestureEvent={onHeaderGestureEvent} 
        onHandlerStateChange={handleHeaderGesture}
        activeOffsetX={[-20, 20]}
        activeOffsetY={[-10, 10]}
        shouldCancelWhenOutside={true}
      >
        <View className="absolute top-0 left-0 right-0 bottom-0 z-[50]" pointerEvents="box-none">
          {/* Fixed Buddy Icon and User Coins - outside of swipe animation */}
          <View className="absolute top-20 left-0 right-0 p-6 z-[60]" pointerEvents="box-none">
            <View className="flex-row justify-between items-start">
              {/* Buddy Icon - Fixed */}
              <Pressable
                className="w-[60px] mt-2.5 p-0.3"
                onPress={handleNavigateToProfile}
              >
                <Pressable
                  className="w-9 h-9 rounded-full bg-black/50 justify-center items-center overflow-hidden border border-amber-400"
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
                        width: 60,
                        height: 60,
                        transform: [{ translateY: 12 }, { scale: 0.9 }],
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
                onPress={handleCoinPurchase}
              >
                  <View className="bg-black/50 flex-row items-center border border-amber-400 pl-2 pr-1.5 py-0 rounded-full self-start mb-1 gap-0.5 text-center">
                    <Text className="text-lg font-bold text-amber-400">{userCoins}</Text>
                    <CoinIcon width={16} height={16} color="#FF6B35" />
                </View>
              </Pressable>
            </View>
          </View>

          <Animated.View
            style={{
              height: backgroundHeight
            }}
            pointerEvents="none"
          >
            <ParallaxBackground scrollY={scrollY} height={390} />
          </Animated.View>

          {/* Fixed Navigation Dots - positioned after HomeHeader, before buddy */}
          <View className="absolute top-[145px] left-0 right-0 z-[20]" pointerEvents="box-none">
            <View className="flex-row justify-center">
              <View className="flex-row bg-black/30 rounded-full px-2 py-1 gap-1">
                {['achievements', 'home', 'shop'].map((view, index) => {
                  // Create scroll position for scale animation
                  const scrollPosition = Animated.divide(contentTranslateX, -width);
                  const scale = scrollPosition.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [1, 1.2, 1],
                    extrapolate: "clamp",
                  });
                  const opacity = scrollPosition.interpolate({
                    inputRange: [index - 0.5, index, index + 0.5],
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: "clamp",
                  });
                  
                  return (
                    <Animated.View
                      key={view}
                      style={{
                        transform: [{ scale }],
                        opacity,
                      }}
                    >
                      <Pressable
                        className={`w-2 h-2 rounded-full ${
                          currentView === view ? "bg-white" : "bg-black/30"
                        }`}
                        onPress={() => changeView(view as any)}
                      />
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Buddy Lottie on top of background */}
          <Animated.View
            className="absolute top-10 left-0 right-0 items-center justify-end"
            style={{ height: 360, zIndex: 30 }}
            pointerEvents="none"
          >
            <Animated.View style={{ transform: buddyTransform }}>
              {buddyAnimSource ? (
                <LottieView
                  key={`home-buddy-play`}
                  source={buddyAnimSource}
                  autoPlay={true}
                  loop={true}
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
              top: 5,
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
              top: 20,
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
              height: scrollableContentHeight,
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
              <View style={{ flex: 1 }}>
                <HomeContent
                  currentView={"achievements" as any}
                  isAchievementsCollapsed={isAchievementsCollapsed}
                  isExclusiveSelected={isExclusiveSelected}
                  isScenesSelected={isScenesSelected}
                  setIsScenesSelected={handleSetIsScenesSelected}
                  onNavigateToShop={handleNavigateToShop}
                />
              </View>
            </Animated.ScrollView>

            {/* Home Page */}
            <Animated.ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={currentView === "home"}
              style={{ width, marginTop: -40, }}
            >
              <View style={{ flex: 1 }}>
                <AchievementSection
                  isCollapsed={isAchievementsCollapsed}
                  onToggle={toggleAchievements}
                  onNavigateToProgressChallenges={handleNavigateToProgressChallenges}
                />

                <View style={{ flex: 1 }}>
                  <HomeContent
                    currentView={"home" as any}
                    isAchievementsCollapsed={isAchievementsCollapsed}
                    isExclusiveSelected={isExclusiveSelected}
                    isScenesSelected={isScenesSelected}
                    setIsScenesSelected={handleSetIsScenesSelected}
                    onNavigateToShop={handleNavigateToShop}
                    onNavigateToBreathing={onShowBreathingExercise}
                  />
                </View>
              </View>
              {/* <CTAButton
                label={t("home.cravingSOS", "Craving SOS")}
                onPress={handleShowCravingSOS}
                tone="danger"
                rightIconName={null}
                containerClassName="absolute bottom-0 left-0 right-0 z-[200]"
              /> */}
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
              <View style={{ flex: 1 }}>
                <HomeContent
                  currentView={"shop" as any}
                  isAchievementsCollapsed={isAchievementsCollapsed}
                  isExclusiveSelected={isExclusiveSelected}
                  isScenesSelected={isScenesSelected}
                  setIsScenesSelected={handleSetIsScenesSelected}
                  onNavigateToShop={handleNavigateToShop}
                />
              </View>
            </Animated.ScrollView>
          </Animated.View>

          {/* Animated Home CTA Button */}
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 200,
              opacity: homeButtonOpacity,
              transform: [{ translateY: homeButtonTranslateY }],
            }}
            pointerEvents={currentView === "home" ? "auto" : "none"}
          >
            {/* LinearGradient Button */}
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                borderRadius: 8, // Match the button's border radius
                paddingHorizontal: 0, // Match container padding
                paddingTop: 16, // Match container padding
                paddingBottom: 8,
              }}
            >
              <CTAButton
                label={t("home.cravingSOS", "Craving SOS")}
                onPress={handleShowCravingSOS}
                tone="danger"
                rightIconName={null}
                containerClassName="px-6 pb-8 bg-transparent"
              />
            </LinearGradient>
          </Animated.View>

          {/* Animated Shop CTA Button - Only show if there are items to buy */}
          {shopTotalCost > 0 && (
            <Animated.View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 200,
                opacity: shopButtonOpacity,
          
                transform: [{ translateY: shopButtonTranslateY }],
              }}
              pointerEvents={currentView === "shop" ? "auto" : "none"}
            >
               <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  borderRadius: 8, // Match the button's border radius
                  paddingHorizontal: 0, // Match container padding
                  paddingTop: 16, // Match container padding
                  paddingBottom: 8,
                }}
              >
                <CTAButton
                  label={shopButtonLabel}
                  onPress={handleBuyAllItems}
                  rightIconName={null}
                  icon={<CoinIcon width={20} height={20} />}
                  containerClassName="px-6 pb-8 bg-transparent"
                  />
                </LinearGradient>
            </Animated.View>
          )}
        </View>
      </PanGestureHandler>
    </View>
  );
};

export default Home;