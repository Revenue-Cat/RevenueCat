import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Image } from "react-native";
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

interface HomeHeaderProps {
  currentView: "home" | "achievements" | "shop";
  onNavigateToProfile: () => void;
  onCoinPurchase: () => void;
  onViewChange: (view: "home" | "achievements" | "shop") => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  currentView,
  onNavigateToProfile,
  onCoinPurchase,
  onViewChange,
}) => {
  const { t } = useTranslation();
  const {
    startDate,
    achievements,
    getProgressForAchievement,
    selectedBuddyId,
    ownedBuddies,
    ownedBackgrounds,
    fetchCoins,
  } = useApp();

  // Get the selected buddy data
  const selectedBuddy = getBuddyById(selectedBuddyId);

  // State for user coins from RevenueCat
  const { userCoins, setUserCoins } = useApp();

  useEffect(() => {
    fetchCoins();
  }, []);

  // Calculate achievements with 100% progress
  const completedAchievementsCount = achievements.filter((achievement) => {
    const progress = getProgressForAchievement(achievement.id);
    return progress.percentage === 100;
  }).length;

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
    fetchCoins();
  };

  return (
    <View
      className="absolute top-8 left-0 right-0 p-6"
      style={{ height: 120, zIndex: 10 }}
      pointerEvents="box-none"
    >
      {/* Top Row */}
      <View className="flex-row justify-between items-start">
        {/* Buddy Icon */}
        <Pressable
          className="w-[60px] mt-2.5 p-0.3"
          onPress={() => {
            console.log(
              "Buddy Icon container pressed - attempting to navigate to profile"
            );
            onNavigateToProfile();
          }}
        >
          <Pressable
            className="w-7 h-7 rounded-full bg-black/50 justify-center items-center overflow-hidden"
            onPress={() => {
              onNavigateToProfile();
            }}
            style={{ position: "relative", transform: [{ translateY: -8 }] }}
          >
            {selectedBuddy ? (
              <LottieView
                source={selectedBuddy.icon}
                // keep static to save battery in header; remove "progress" and set loop=true for animation
                // show first frame
                // @ts-ignore - Lottie types allow this prop at runtime
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

        {/* Carousel Header - Centered with Consistent Layout */}
        <View className="items-center justify-center flex-1">
          {/* Title - Consistent positioning */}
          <Text className="text-lg font-bold text-indigo-950 leading-7 text-center mt-2">
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
                  <Text className="text-s font-medium text-indigo-950/50 leading-4 text-center">
                    {t("countdownTimer.days")}
                  </Text>
                </View>
              )
            )}

            {/* Achievements View - Completed Count */}
            {currentView === "achievements" && (
              <View className="items-center">
                <View className="flex-row items-baseline">
                  <Text className="text-3xl font-bold text-indigo-950">
                    {completedAchievementsCount}
                  </Text>
                  <Text className="text-lg font-bold text-indigo-950/50">
                    /{achievements.length}
                  </Text>
                </View>
                <Text className="text-s font-medium text-indigo-950/50 leading-4 text-center mt-0.5">
                  {t("home.badgesCollected")}
                </Text>
              </View>
            )}

            {/* Shop View - Goodies Count */}
            {currentView === "shop" && (
              <View className="items-center">
                <View className="flex-row items-baseline">
                  <Text className="text-3xl font-bold text-indigo-950">
                    {goodiesCount}
                  </Text>
                </View>
                <Text className="text-s font-medium text-indigo-950/50 leading-4 text-center">
                  {t("home.goodiesAvailable", "Goodies available")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* User Coins */}
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

      {/* Bottom Row - Navigation Dots */}
      <View className="flex-row justify-center mt-1">
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
      </View>
    </View>
  );
};

export default HomeHeader;
