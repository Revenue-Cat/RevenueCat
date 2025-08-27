import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import CountdownTimer from "./CountdownTimer";
import CoinIcon from "../assets/icons/coins.svg";
import { useApp } from "../contexts/AppContext";
import { getBuddyById } from "../data/buddiesData";
import { BUDDIES_DATA } from "../data/buddiesData";
import { SCENES_DATA } from "../data/scenesData";

interface HomeHeaderProps {
  currentView: "home" | "achievements" | "shop";
  userCoins: number;
  onNavigateToProfile: () => void;
  onCoinPurchase: () => void;
  onViewChange: (view: "home" | "achievements" | "shop") => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  currentView,
  userCoins,
  onNavigateToProfile,
  onCoinPurchase,
  onViewChange,
}) => {
  const { t } = useTranslation();
  const { startDate, achievements, getProgressForAchievement, selectedBuddyId, ownedBuddies, ownedBackgrounds } = useApp();
  
  // Get the selected buddy data
  const selectedBuddy = getBuddyById(selectedBuddyId);


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
  const purchasableBuddies = BUDDIES_DATA.filter(b => !ownedBuddies?.includes(b.id)).length;
  const purchasableScenes = SCENES_DATA.filter(s => !ownedBackgrounds?.includes(s.id)).length;
  const goodiesCount = purchasableBuddies + purchasableScenes;

  return (
    <View
      className="absolute top-10 left-0 right-0 p-6"
      style={{ height: 140, zIndex: 20 }}
      pointerEvents="box-none"
    >
      {/* Top Row */}
      <View className="flex-row justify-between items-start">
        {/* Buddy Icon */}
        <Pressable
          className="w-[66px] mt-3 p-0.3"
          onPress={() => {
            console.log("Buddy Icon container pressed - attempting to navigate to profile");
            onNavigateToProfile();
          }}
        >
          <Pressable
            className="w-8 h-8 rounded-full bg-black/50 justify-center items-center overflow-hidden"
            onPress={() => {
              onNavigateToProfile();
            }}
            style={{ position: 'relative', transform: [{ translateY: -10 }] }}
          >
            {selectedBuddy ? (
              <View className="w-full h-full overflow-hidden">
                <Image 
                  source={selectedBuddy.icon} 
                  style={{
                    width: '100%',
                    height: '220%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <Ionicons name="person-outline" size={18} color="#ffffff" />
            )}
          </Pressable>
        </Pressable>
        {/* Carousel Header - Centered */}
        <View className="items-center justify-center flex-1">
          {/* Title */}
          <Text className="text-lg font-bold text-indigo-950 leading-7 text-center">
            {getViewTitle()}
          </Text>

          {/* Timer Units - Only show for Home view */}
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
                <Text className="text-xs font-medium text-indigo-950/50 leading-4 text-center">
                  {t("countdownTimer.days")}
                </Text>
              </View>
            )
          )}

          {/* Preview content for other views */}
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
              <Text className="text-xs font-medium text-indigo-950/50 leading-4 text-center mt-1">
                {t("home.badgesCollected")}
              </Text>
            </View>
          )}

          {currentView === "shop" && (
            <View className="items-center mt-2">
              <View className="flex-row items-baseline">
                <Text className="text-3xl font-bold text-indigo-950">{goodiesCount}</Text>
              </View>
              <Text className="text-xs font-medium text-indigo-950/50 leading-4 text-center mt-1">
                {t("home.goodiesAvailable", "Goodies available")}
              </Text>
            </View>
          )}
        </View>
        {/* User Coins */}
        <Pressable
          className="flex-row items-center bg-black/50 w-[66px] h-8 rounded-3xl py-1 px-2.5 gap-2"
          onPress={onCoinPurchase}
        >
          <Text className="text-base font-semibold text-amber-500 leading-6">
            {userCoins}
          </Text>
          <CoinIcon width={16} height={16} />
        </Pressable>
      </View>

      {/* Bottom Row - Navigation Dots */}
      <View className="flex-row justify-center mt-1">
        <View className="flex-row bg-black/30 w-10 h-3 rounded-full px-1 py-0.5 gap-1">
          <Pressable
            className={`w-2 h-2 rounded-full ${
              currentView === "achievements" ? "bg-white" : "bg-black/30"
            }`}
            onPress={() => onViewChange("achievements")}
          />
          <Pressable
            className={`w-2 h-2 rounded-full ${
              currentView === "home" ? "bg-white" : "bg-black/30"
            }`}
            onPress={() => onViewChange("home")}
          />
          <Pressable
            className={`w-2 h-2 rounded-full ${
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
