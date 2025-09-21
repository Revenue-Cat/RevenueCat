import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, Image, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import CountdownTimer from "./CountdownTimer";
import CoinIcon from "../assets/icons/coins.svg";
import { useApp } from "../contexts/AppContext";
import { getBuddyById } from "../data/buddiesData";
import { BUDDIES_DATA } from "../data/buddiesData";
import { SCENES_DATA } from "../data/scenesData";
import Purchases from "react-native-purchases";
import LottieView from "lottie-react-native";
import { CHALLENGES_DATA } from "../data/challengesData";

interface HomeHeaderProps {
  currentView: "home" | "achievements" | "shop";
  onNavigateToProfile: () => void;
  onCoinPurchase: () => void;
  onViewChange: (view: "home" | "achievements" | "shop") => void;
  scrollY?: Animated.Value;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  currentView,
  onNavigateToProfile,
  onCoinPurchase,
  onViewChange,
  scrollY,
}) => {
  const { t } = useTranslation();
  const {
    startDate,
    achievements,
    getProgressForAchievement,
    selectedBuddyId,
    ownedBuddies,
    ownedBackgrounds,
    refreshCoinsBalance,
    getChallengeStatus,
    getChallengeProgress,
    getChallengeCompletions,
  } = useApp();

  // Get the selected buddy data
  const selectedBuddy = getBuddyById(selectedBuddyId);

  // State for user coins from RevenueCat
  const { userCoins, setUserCoins } = useApp();

  useEffect(() => {
    refreshCoinsBalance();
  }, []);

  // Use the same transform as the ShopToggle for scroll animation
  const transform = useMemo(() => {
    if (!scrollY) return [];
    return [{
      translateY: scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [0, -70],
        extrapolate: 'clamp'
      })
    }];
  }, [scrollY]);

  // Calculate achievements with 100% progress
  const completedAchievementsCount = achievements.filter((achievement) => {
    const progress = getProgressForAchievement(achievement.id);
    return progress.percentage === 100;
  }).length || 0;


  const completedChallengesCount = CHALLENGES_DATA.filter((challenge) => {
    const status = getChallengeStatus(challenge.id);
    const previousCompletions = getChallengeCompletions(challenge.id);
      
    return status === 'completed' || previousCompletions.length > 0;
  }).length || 0;

  const getViewTitle = () => {
    switch (currentView) {
      case "home":
        return t("home.title");
      case "achievements":
        return t("home.achievements");
      case "shop":
        return t("home.shop");
      default:
        return t("home.title");
    }
  };

  // Show only purchasable items (not owned)
  const purchasableBuddies = BUDDIES_DATA.filter(
    (b) => !ownedBuddies?.includes(b.id)
  ).length;
  const purchasableScenes = SCENES_DATA.filter(
    (s) => !ownedBackgrounds?.includes(s.id)
  ).length;
  const goodiesCount = purchasableBuddies + purchasableScenes;

  const handleCoinPurchase = async () => {
    onCoinPurchase();
    refreshCoinsBalance();
  };

  return (
    <Animated.View
      className="absolute top-10 left-0 right-0 p-4"
      style={{ 
        zIndex: 10,
      }}
      pointerEvents="box-none"
    >
      {/* Carousel Header - Centered with Consistent Layout */}
      <View className="items-center justify-center flex-1 mt-2">
        {/* Title - Consistent positioning */}
        <Text className="text-xl font-semibold text-indigo-950 leading-7 text-center uppercase opacity-70 mb-1">
          {getViewTitle()}
        </Text>

        {/* Content Container - Fixed height for consistent positioning */}
        <View className="h-12 items-center justify-center">
          {/* Home View - CountdownTimer */}
          {currentView === "home" && startDate ? (
            <CountdownTimer
              targetDate={startDate}
              textColor="text-indigo-950"
              textSize="lg"
              showSeconds={false}
              countUp={true}
            />
          ) : (
            currentView === "home" && (
              <View className="items-center">
                <Text className="text-3xl font-bold text-indigo-950">00</Text>
                <Text className="text-lg font-medium text-indigo-950/50 text-center mt-0.5">
                  {t("countdownTimer.days")}
                </Text>
              </View>
            )
          )}

          {/* Achievements View - Completed Count */}
          {currentView === "achievements" && (
            <View className="h-12 items-center justify-center">
              <View className="flex-row items-baseline">
                <Text className="text-4xl font-semibold text-indigo-950 text-center">
                  {completedAchievementsCount + completedChallengesCount}
                </Text>
                <Text className="text-lg font-semibold text-indigo-950/50">
                  /{achievements.length + CHALLENGES_DATA.length}
                </Text>
              </View>
              <Text className="text-s font-medium text-indigo-950/50 text-center">
                {t("home.badgesCollected")}
              </Text>
            </View>
          )}

          {/* Shop View - Goodies Count */}
          {currentView === "shop" && (
            <View className="h-12 items-center justify-center">
              <View className="flex-row items-baseline">
                <Text className="text-4xl font-semibold text-indigo-950">
                  {goodiesCount}
                </Text>
              </View>
              <Text className="text-s font-medium text-indigo-950/50 text-center">
                {t("home.goodiesAvailable", "Goodies available")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Row - Navigation Dots */}
      {/* <View className="flex-row justify-center mt-2">
        <View className="flex-row bg-black/30 w-8 h-2.5 rounded-full px-1 py-0.5 gap-1">
          <Pressable
            className={`w-1.5 h-1.5 rounded-full ${
              currentView === "achievements" ? "bg-white" : "bg-black/30"
            }`}
            onPress={() => onViewChange("achievements")}
          />
          <Pressable
            className={`w-1.5 h-1.5 rounded-full ${
              currentView === "home" ? "bg-white" : "bg-black/30"
            }`}
            onPress={() => onViewChange("home")}
          />
          <Pressable
            className={`w-1.5 h-1.5 rounded-full ${
              currentView === "shop" ? "bg-white" : "bg-black/30"
            }`}
            onPress={() => onViewChange("shop")}
          />
        </View>
      </View> */}
    </Animated.View>
  );
};

export default HomeHeader;
