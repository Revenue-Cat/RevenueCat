// src/screens/Shop.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { buddyAssets, SexKey } from "../assets/buddies";
import { getTranslatedBuddyData, PLACEHOLDER_BUDDY } from "../data/buddiesData";
import { getTranslatedSceneData, PLACEHOLDER_SCENE } from "../data/scenesData";
import BuddyModal from "../components/BuddyModal";
import SceneModal from "../components/SceneModal";
import CoinIcon from "../assets/icons/coins.svg";
import LottieView from "lottie-react-native";
import LockLight from "../assets/icons/lock.svg";

interface ShopProps {
  onBack: () => void;
  isScenesSelected: boolean;
  setIsScenesSelected: (isScenes: boolean) => void;
}

const Shop: React.FC<ShopProps> = ({
  onBack,
  isScenesSelected,
  setIsScenesSelected,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const {
    userCoins,
    selectedBuddy,
    selectedBackground,
    ownedBuddies,
    ownedBackgrounds,
    ownedAccessories,
    setSelectedBuddy,
    setSelectedBackground,
    purchaseItem,
    setShowCoinPurchase,
    selectedBuddyId,
    setSelectedBuddyId,
    gender,
  } = useApp();

  // Only show buddies for the user's gender
  const sexKey: SexKey = gender === "lady" ? "w" : "m";

  const [selectedBuddyForModal, setSelectedBuddyForModal] = useState<any>(null);
  const [showBuddyModal, setShowBuddyModal] = useState(false);
  const [hidePurchaseButton, setHidePurchaseButton] = useState(false);
  const [selectedSceneForModal, setSelectedSceneForModal] = useState<any>(null);
  const [showSceneModal, setShowSceneModal] = useState(false);
  
  // Animation state for content transitions
  const [contentOpacity] = useState(new Animated.Value(1));
  const [contentTranslateY] = useState(new Animated.Value(0));

  // Animation effect when toggling between buddies and scenes
  useEffect(() => {
    Animated.sequence([
      // Fade out and slide up
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Fade in and slide down
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [isScenesSelected, contentOpacity, contentTranslateY]);

  // Helper function to parse gradient string and return colors
  const parseGradient = useCallback(
    (gradientString: string): [string, string] => {
      const colorMatch = gradientString.match(/#[A-Fa-f0-9]{6}/g);
      if (colorMatch && colorMatch.length >= 2) {
        return [colorMatch[0], colorMatch[1]];
      }
      return ["#1F1943", "#4E3EA9"]; // Default
    },
    []
  );

  // Function to handle buddy selection
  const handleBuddySelect = (buddy: any) => {
    if (ownedBuddies?.includes(buddy.id)) {
      setSelectedBuddyId(buddy.id);
    } else {
      setSelectedBuddyForModal(buddy);
      // Check if this is a PLACEHOLDER_BUDDY item
      const isPlaceholderBuddy = PLACEHOLDER_BUDDY.some(pb => pb.id === buddy.id);
      setHidePurchaseButton(isPlaceholderBuddy);
      setShowBuddyModal(true);
    }
  };

  // Function to handle scene selection
  const handleSceneSelect = (scene: any) => {
    if (ownedBackgrounds.includes(scene.id)) {
      setSelectedBackground(scene);
    } else {
      setSelectedSceneForModal(scene);
      setShowSceneModal(true);
    }
  };

  // i18n data
  const translatedBuddies = useMemo(() => getTranslatedBuddyData(t), [t]);
  const translatedScenes = useMemo(() => getTranslatedSceneData(t), [t]);
  const scenes = translatedScenes;


  const genderBuddies = useMemo(
    () => translatedBuddies.filter((b) => b.id.endsWith(`-${sexKey}`)),
    [translatedBuddies, sexKey]
  );

  const renderBuddiesGrid = () => (
    <View className="w-full flex-row flex-wrap">
      {genderBuddies.map((item) => {
        const isOwned = ownedBuddies?.includes(item.id) || false;
        const isSelected = selectedBuddyId === item.id;

        return (
          <Pressable
            key={item.id}
            className="w-1/4 px-1 py-1"
            onPress={() => handleBuddySelect(item)}
          >
            <View
              className={`items-center rounded-xl relative ${
                isDark ? "bg-slate-700/50" : "bg-white/10"
              }`}
            >
              <View className="w-[80px] h-[80px] overflow-hidden relative">
                {/* item.icon is a Lottie JSON (from buddyAssets), so render via LottieView */}
                <LottieView
                  source={item.icon}
                  autoPlay={isSelected}
                  loop={isSelected}
                  {...(!isSelected ? ({ progress: 0 } as any) : {})}
                  style={{ width: 80, height: 110, marginTop: -5 }}
                  resizeMode="contain"
                  enableMergePathsAndroidForKitKatAndAbove
                />

                {!isOwned && (
                  <View className="absolute bottom-1 left-4 z-10 rounded-3xl bg-black/70 px-2 py-0.5">
                    <View className="flex-row items-center justify-center">
                      <Text className="text-s font-bold text-amber-500 gap-2">
                        {item.coin}
                      </Text>
                      <CoinIcon width={16} height={16} className="ml-1" />
                    </View>
                  </View>
                )}
              </View>

              {isSelected && (
                <View className="absolute top-1 right-1">
                  <Ionicons
                    className="bg-green-500 rounded-full p-0.5 bold"
                    name="checkmark"
                    size={18}
                    color="white"
                  />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
      {PLACEHOLDER_BUDDY.map((item) => {
        const isOwned = ownedBuddies?.includes(item.id) || false;
        const isSelected = selectedBuddyId === item.id;

        return (
          <Pressable
            key={item.id}
            className="w-1/4 px-1 py-1"
            onPress={() => handleBuddySelect(item)}
          >
            <View
              className={`items-center rounded-xl relative ${
                isDark ? "bg-slate-700/50" : "bg-white/10"
              }`}
            >
              <View className="w-[80px] h-[80px] overflow-hidden relative">
                {/* PLACEHOLDER_BUDDY.icon is an SVG component, so render directly */}
                {/* Show only half of the icon by using 110px height in 80px container */}
                <View
                  style={{
                    width: 80,
                    height: 110,        // Icon full height
                    marginTop: -5,     // Negative margin to show bottom hal0
                    alignItems: 'center',
                    justifyContent: 'flex-end'  // Align to bottom to show lower half
                  }}
                >
                  {React.createElement(item.icon, {
                    width: 95,
                    height: 95,        // Full icon height
                    color: isSelected ? "#22C55E" : (isDark ? "#94A3B8" : "#FFFFFF33"),
                    // opacity: 0.2
                  })}
                </View>

                {!isOwned && (
                  <View className="absolute top-1 right-1 z-10 rounded-3xl bg-black/40 p-1.5">
                      <LockLight width={12} height={12} color="white" opacity={0.5} />
                  </View>
                )}
              </View>

              {isSelected && (
                <View className="absolute top-1 right-1">
                  <Ionicons
                    className="bg-green-500 rounded-full p-0.5 bold"
                    name="checkmark"
                    size={18}
                    color="white"
                  />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  const renderScenesGrid = () => (
    <View className="w-full flex-row flex-wrap">
      {scenes.map((item) => {
        const isOwned = ownedBackgrounds.includes(item.id);
        const isSelected = selectedBackground.id === item.id;

        return (
          <Pressable
            key={item.id}
            className="w-1/4 px-1 py-1"
            onPress={() => handleSceneSelect(item)}
          >
            <View
              className={`items-center rounded-xl relative ${
                isDark ? "bg-slate-700/50" : "bg-white/10"
              }`}
            >
              <View className="w-[80px] h-[80px] overflow-hidden relative">
                <Image
                  source={item.background}
                  className="w-full h-full rounded-2xl"
                  resizeMode="cover"
                />
                {!isOwned && (
                  <View className="absolute bottom-1 left-4 z-10 rounded-3xl bg-black/70 px-2 py-0.5">
                    <View className="flex-row items-center justify-center">
                      <Text className="text-s font-bold text-amber-500 gap-2">
                        {item.coin}
                      </Text>
                      <CoinIcon width={16} height={16} className="ml-1" />
                    </View>
                  </View>
                )}
              </View>

              {isSelected && (
                <View className="absolute top-1 right-1">
                  <Ionicons
                    className="bg-green-500 rounded-full p-0.5 bold"
                    name="checkmark"
                    size={18}
                    color="white"
                  />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
      {PLACEHOLDER_SCENE.map((item) => {
        const isOwned = ownedBackgrounds.includes(item.id) || false;
        const isSelected = selectedBackground.id === item.id;

        return (
          <Pressable
            key={item.id}
            className="w-1/4 px-1 py-1"
            onPress={() => handleSceneSelect(item)}
          >
            <View
              className={`items-center rounded-xl relative ${
                isDark ? "bg-slate-700/50" : "bg-white/10"
              }`}
            >
              <View className="w-[80px] h-[80px] overflow-hidden relative">
                {/* PLACEHOLDER_SCENE.icon is an SVG component, so render directly */}
                <View
                  style={{
                    width: 80,
                    height: 80,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {React.createElement(item.icon, {
                    width: 80,
                    height: 80,
                     color: isSelected ? "#22C55E" : (isDark ? "#94A3B8" : "#FFFFFF33"),
                    // opacity: 0.5
                  })}
                </View>

                {!isOwned && (
                  <View className="absolute top-1 right-1 z-10 rounded-3xl bg-black/40 p-1.5">
                    <LockLight width={12} height={12} color="white" opacity={0.5} />
                  </View>
                )}
              </View>

              {isSelected && (
                <View className="absolute top-1 right-1">
                  <Ionicons
                    className="bg-green-500 rounded-full p-0.5 bold"
                    name="checkmark"
                    size={18}
                    color="white"
                  />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  const gradientColors = parseGradient(selectedBackground.backgroundColor || "linear-gradient(179.97deg, #1F1943 48.52%, #4E3EA9 99.97%)");

  // Handle individual buddy purchase
  const handleBuyBuddy = useCallback(async (buddy: any) => {
    try {
      const success = await purchaseItem(buddy, 'buddies');
      if (success) {
        console.log(`Successfully purchased buddy ${buddy.name}`);
        setShowBuddyModal(false);
        setSelectedBuddyForModal(null);
        setHidePurchaseButton(false);
      } else {
        console.log('Buddy purchase failed - not enough coins');
        // Show coin purchase modal (BuddyModal is already closed by BuddyModalActions)
        setShowCoinPurchase(true);
      }
    } catch (error) {
      console.error('Error purchasing buddy:', error);
    }
  }, [purchaseItem, setShowCoinPurchase]);

  // Handle individual scene purchase
  const handleBuyScene = useCallback(async (scene: any) => {
    try {
      const success = await purchaseItem(scene, 'backgrounds');
      if (success) {
        console.log(`Successfully purchased scene ${scene.name}`);
        setShowSceneModal(false);
        setSelectedSceneForModal(null);
      } else {
        console.log('Scene purchase failed - not enough coins');
        // Show coin purchase modal (SceneModal is already closed by SceneModalActions)
        setShowCoinPurchase(true);
      }
    } catch (error) {
      console.error('Error purchasing scene:', error);
    }
  }, [purchaseItem, setShowCoinPurchase]);

  return (
    <View
      className={`flex-1 `}
      // style={{ backgroundColor: isDark ? undefined : gradientColors[0] }}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslateY }],
        }}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 4,
            paddingVertical: 20,
            minHeight: Dimensions.get("window").height * 0.8,
          }}
        >
          <View className="flex-1">
            {!isScenesSelected ? renderBuddiesGrid() : renderScenesGrid()}
          </View>
        </ScrollView>
      </Animated.View>

      <BuddyModal
        visible={showBuddyModal}
        buddy={selectedBuddyForModal}
        onClose={() => {
          setShowBuddyModal(false);
          setSelectedBuddyForModal(null);
          setHidePurchaseButton(false);
        }}
        onPurchase={handleBuyBuddy}
        hidePurchaseButton={hidePurchaseButton}
      />

      <SceneModal
        visible={showSceneModal}
        scene={selectedSceneForModal}
        onClose={() => {
          setShowSceneModal(false);
          setSelectedSceneForModal(null);
        }}
        onPurchase={handleBuyScene}
      />
    </View>
  );
};

export default Shop;
