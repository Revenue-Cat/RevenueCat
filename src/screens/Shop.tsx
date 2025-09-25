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
import { getTranslatedBuddyData, getTranslatedPlaceholderBuddyData, PLACEHOLDER_BUDDY } from "../data/buddiesData";
import { getTranslatedSceneData, getTranslatedPlaceholderSceneData, PLACEHOLDER_SCENE } from "../data/scenesData";
import BuddyModal from "../components/BuddyModal";
import SceneModal from "../components/SceneModal";
import { renderCombinedGrid } from "../utils/gridUtils";

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
      const isPlaceholderBuddy = translatedPlaceholderBuddies.some(pb => pb.id === buddy.id);
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
  const translatedPlaceholderBuddies = useMemo(() => getTranslatedPlaceholderBuddyData(t), [t]);
  const translatedScenes = useMemo(() => getTranslatedSceneData(t), [t]);
  const translatedPlaceholderScenes = useMemo(() => getTranslatedPlaceholderSceneData(t), [t]);
  const scenes = translatedScenes;


  const genderBuddies = useMemo(
    () => translatedBuddies.filter((b) => b.id.endsWith(`-${sexKey}`)),
    [translatedBuddies, sexKey]
  );


  const renderBuddiesGrid = () => {
    return renderCombinedGrid(
      genderBuddies,
      translatedPlaceholderBuddies,
      ownedBuddies || [],
      selectedBuddyId,
      handleBuddySelect,
      'buddy',
      isDark
    );
  };

  const renderScenesGrid = () => {
    return renderCombinedGrid(
      scenes,
      translatedPlaceholderScenes,
      ownedBackgrounds,
      selectedBackground.id,
      handleSceneSelect,
      'scene',
      isDark
    );
  };

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
      className={`flex-1 pt-[20px]`}
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
