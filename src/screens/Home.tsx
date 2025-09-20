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

  const gradientColors = parseGradient(selectedBackground?.backgroundColor || '#4A90E2');

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
    return availableScenes.reduce((total, scene) => total + (scene.coin || 0), 0);
  }, [ownedBackgrounds, t]);

  // Get the appropriate total cost and label based on current shop tab
  const shopTotalCost = useMemo(() => {
    return isScenesSelected ? totalSceneCost : totalBuddyCost;
  }, [isScenesSelected, totalSceneCost, totalBuddyCost]);

  const shopButtonLabel = useMemo(() => {
    const itemType = isScenesSelected ? "scenes" : "buddies";
    return `Get all ${itemType} for ${shopTotalCost}`;
  }, [isScenesSelected, shopTotalCost]);

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
            price: scene.coin || 0,
            owned: scene.owned || false,
            coin: scene.coin || 0, // Add coin field for compatibility
          };
          await purchaseItem(shopItem, 'backgrounds');
        } catch (error) {
          console.error(`Failed to purchase ${scene.name}:`, error);
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
          console.error(`Failed to purchase ${buddy.name}:`, error);
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
                  className="w-8 h-8 rounded-full bg-black/50 justify-center items-center overflow-hidden"
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
                className="flex-row items-center justify-center bg-black/50 w-[70px] h-8 rounded-3xl py-1 px-2 gap-1.5"
                onPress={handleCoinPurchase}
              >
                <Text className="text-base font-semibold text-amber-500 leading-6">
                  {userCoins}
                </Text>
                <CoinIcon width={16} height={16} />
              </Pressable>
            </View>
          </View>

          {/* TEST BUTTONS - Temporary for notification testing */}
          <View className="absolute top-32 left-4 right-4 z-[70]" pointerEvents="box-none">
            {/* Basic Connectivity Test Button */}
            {/* <Pressable
              className="bg-gray-500 rounded-lg py-3 px-4 mb-2"
              onPress={async () => {
                try {
                  console.log('🌐 Testing basic OneSignal connectivity...');
                  await testBasicOneSignalConnectivity();
                  console.log('✅ Basic connectivity test complete');
                  alert('Basic OneSignal connectivity test complete! Check console for details.');
                } catch (error) {
                  console.error('❌ Basic connectivity test failed:', error);
                  alert('Basic connectivity test failed: ' + (error as Error).message);
                }
              }}
            >
              <Text className="text-white text-center font-bold">
                🌐 Test Connectivity
              </Text>
            </Pressable> */}

            {/* User Registration Test Button */}
            {/* <Pressable
              className="bg-indigo-500 rounded-lg py-3 px-4 mb-2"
              onPress={async () => {
                try {
                  console.log('👤 Testing user registration with OneSignal...');
                  await testUserRegistration();
                  console.log('✅ User registration test complete');
                  alert('User registration test complete! Check console for details.');
                } catch (error) {
                  console.error('❌ User registration test failed:', error);
                  alert('User registration test failed: ' + (error as Error).message);
                }
              }}
            >
              <Text className="text-white text-center font-bold">
                👤 Test User Registration
              </Text>
            </Pressable> */}

            {/* Test Configuration Button */}
            {/* <Pressable
              className="bg-yellow-500 rounded-lg py-3 px-4 mb-2"
              onPress={async () => {
                try {
                  console.log('🧪 Testing OneSignal configuration...');
                  await testOneSignalConfiguration();
                  console.log('✅ Configuration test complete');
                  alert('OneSignal configuration test complete! Check console for details.');
                } catch (error) {
                  console.error('❌ Configuration test failed:', error);
                  alert('Configuration test failed: ' + (error as Error).message);
                }
              }}
            >
              <Text className="text-white text-center font-bold">
                🧪 Test Config
              </Text>
            </Pressable> */}

            {/* Status Check Button */}
            {/* <Pressable
              className="bg-purple-500 rounded-lg py-3 px-4 mb-2"
              onPress={async () => {
                try {
                  console.log('🔍 Checking notification status...');
                  await checkNotificationStatus();
                  console.log('✅ Status check complete');
                  alert('Status check complete! Check console for details.');
                } catch (error) {
                  console.error('❌ Status check failed:', error);
                  alert('Status check failed: ' + (error as Error).message);
                }
              }}
            >
              <Text className="text-white text-center font-bold">
                🔍 Check Status
              </Text>
            </Pressable> */}

            {/* Simple Push Notification Button */}
            {/* <Pressable
              className="bg-orange-500 rounded-lg py-3 px-4 mb-2"
              onPress={async () => {
                try {
                  console.log('📱 Testing simple push notification...');
                  await sendSimplePushNotification("📱 Simple Push Test - This should work!");
                  console.log('✅ Simple push notification sent');
                  alert('Simple push notification sent! You should see it RIGHT NOW!');
                } catch (error) {
                  console.error('❌ Simple push test failed:', error);
                  alert('Simple push test failed: ' + (error as Error).message);
                }
              }}
            >
              <Text className="text-white text-center font-bold">
                📱 Simple Push Test
              </Text>
            </Pressable> */}







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
          <View className="absolute top-[130px] left-0 right-0 z-[20]" pointerEvents="box-none">
            <View className="flex-row justify-center">
              <View className="flex-row bg-black/30 rounded-full px-2 py-1 gap-1">
                <Pressable
                  className={`w-2 h-2 rounded-full ${
                    currentView === "achievements" ? "bg-white" : "bg-black/30"
                  }`}
                  onPress={() => changeView("achievements")}
                />
                <Pressable
                  className={`w-2 h-2 rounded-full ${
                    currentView === "home" ? "bg-white" : "bg-black/30"
                  }`}
                  onPress={() => changeView("home")}
                />
                <Pressable
                  className={`w-2 h-2 rounded-full ${
                    currentView === "shop" ? "bg-white" : "bg-black/30"
                  }`}
                  onPress={() => changeView("shop")}
                />
              </View>
            </View>
          </View>

          {/* Buddy Lottie on top of background */}
          <Animated.View
            className="absolute top-5 left-0 right-0 items-center justify-end"
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
              style={{ width, paddingBottom: 100 }}
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
              style={{ width }}
            >
              <View style={{ flex: 1 }}>
             

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