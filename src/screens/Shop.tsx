// src/screens/Shop.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { buddyAssets, SexKey } from "../assets/buddies";
import { getTranslatedBuddyData } from "../data/buddiesData";
import { getTranslatedSceneData } from "../data/scenesData";
import BuddyModal from "../components/BuddyModal";
import SceneModal from "../components/SceneModal";
import CoinIcon from "../assets/icons/coins.svg";
import LottieView from "lottie-react-native";

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
  const [selectedSceneForModal, setSelectedSceneForModal] = useState<any>(null);
  const [showSceneModal, setShowSceneModal] = useState(false);

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

  // ⬇️ Filter buddies by gender suffix: '-m' or '-w'
  const genderBuddies = useMemo(
    () => translatedBuddies.filter((b) => b.id.endsWith(`-${sexKey}`)),
    [translatedBuddies, sexKey]
  );

  const renderBuddiesGrid = () => (
    <View className="w-full -mx-1 -my-1 flex-row flex-wrap">
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
              className={`items-center rounded-xl p-2 relative ${
                isDark ? "bg-slate-700/50" : "bg-white/10"
              } ${
                isOwned && !isSelected
                  ? isDark
                    ? "bg-slate-600/50"
                    : "bg-white/15"
                  : ""
              }`}
            >
              <View className="w-[80px] h-[80px] overflow-hidden relative">
                {/* item.icon is a Lottie JSON (from buddyAssets), so render via LottieView */}
                <LottieView
                  source={item.icon}
                  autoPlay={isSelected}
                  loop={isSelected}
                  {...(!isSelected ? ({ progress: 0 } as any) : {})}
                  style={{ width: 80, height: 110 }}
                  resizeMode="contain"
                  enableMergePathsAndroidForKitKatAndAbove
                />

                {!isOwned && (
                  <View className="absolute bottom-1 left-4 z-10 rounded-3xl bg-black/70 px-2 py-0.5">
                    <View className="flex-row items-center justify-center">
                      <Text className="text-xs font-bold text-amber-500 gap-2">
                        {item.coin}
                      </Text>
                      <CoinIcon width={18} height={18} className="ml-1" />
                    </View>
                  </View>
                )}
              </View>

              {isSelected && (
                <View className="absolute top-1 right-1">
                  <Ionicons
                    className="bg-green-500 rounded-full p-0 bold"
                    name="checkmark"
                    size={18}
                    color="white"
                    fill="white"
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
    <View className="w-full -mx-1 -my-1 flex-row flex-wrap">
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
                      <Text className="text-xs font-bold text-amber-500 gap-2">
                        {item.coin}
                      </Text>
                      <CoinIcon width={18} height={18} className="ml-1" />
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
    </View>
  );

  const gradientColors = parseGradient(selectedBackground.backgroundColor);

  return (
    <View
      className={`flex-1 ${isDark ? "bg-dark-background" : ""}`}
      style={{ backgroundColor: isDark ? undefined : gradientColors[0] }}
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

      <BuddyModal
        visible={showBuddyModal}
        buddy={selectedBuddyForModal}
        onClose={() => {
          setShowBuddyModal(false);
          setSelectedBuddyForModal(null);
        }}
      />

      <SceneModal
        visible={showSceneModal}
        scene={selectedSceneForModal}
        onClose={() => {
          setShowSceneModal(false);
          setSelectedSceneForModal(null);
        }}
      />
    </View>
  );
};

export default Shop;
