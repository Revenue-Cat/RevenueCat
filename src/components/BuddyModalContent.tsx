// src/components/BuddyModalContent.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import CoinIcon from "../assets/icons/coins.svg";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";
import { PLACEHOLDER_BUDDY } from "../data/buddiesData";
import LockLight from "../assets/icons/lock.svg";
interface BuddyModalContentProps {
  buddy: any; // expects { id, name, description, icon, coin }
  userCoins: number;
}

const BuddyModalContent: React.FC<BuddyModalContentProps> = ({
  buddy,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const { ownedBuddies, selectedBuddyId, gender, userCoins } = useApp();

  const isOwned = ownedBuddies?.includes(buddy?.id) || false;
  const isSelected = selectedBuddyId === buddy?.id;

  // 1) Try to resolve lottie by buddy.id formatted as "<base>-<sex>" (e.g., "zebra-m")
  // 2) Fallback to buddy.icon if it's a Lottie JSON (non-number)
  // 3) Final fallback: treat buddy.icon as PNG (number)
  const resolveLottieSource = (): any | null => {
    const rawId: string = buddy?.id || "";
    const parts = rawId.split("-");
    const base = parts[0] as BuddyKey | undefined;
    const sex = (parts[1] as SexKey | undefined) || (gender === "lady" ? "w" : "m");

    if (base && sex && buddyAssets[base] && buddyAssets[base][sex]) {
      return buddyAssets[base][sex];
    }

    // If icon is a Lottie JSON (require on JSON returns an object; PNG returns a number)
    if (buddy?.icon && typeof buddy.icon !== "number") {
      return buddy.icon;
    }

    return null;
  };

  const lottieSource = resolveLottieSource();
  const isImageIcon = typeof buddy?.icon === "number"; // PNGs are numbers in RN
  const isPlaceholderBuddy = PLACEHOLDER_BUDDY.some(pb => pb.id === buddy?.id); // Check if this is a PLACEHOLDER_BUDDY


  const renderBuddyVisual = () => {
    return (
      <View className="w-full h-full relative rounded-2xl overflow-hidden justify-center items-center">
        {isPlaceholderBuddy ? (
          // Render SVG icon for PLACEHOLDER_BUDDY
          <View className="w-full h-full justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
            {buddy?.icon && React.createElement(buddy.icon, {
              height: 220,
              color: (isDark ? "#94A3B8" : "#CBD5E1")
            })}
          </View>
        ) : lottieSource ? (
          // Render Lottie animation
          <View className="w-full h-full justify-center items-center">
            <LottieView
              source={lottieSource}
              autoPlay
              loop
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
              enableMergePathsAndroidForKitKatAndAbove
            />
          </View>
        ) : isImageIcon ? (
          // Render PNG image
          <View className="w-full h-full justify-center items-center">
            <Image source={buddy?.icon} className="w-40 h-40" resizeMode="contain" />
          </View>
        ) : (
          // Fallback empty view
          <View className="w-full h-full justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800" />
        )}

        {/* Status Badges */}
        {isSelected && (
          <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-8 h-8 justify-center items-center">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
        {isOwned && !isSelected && (
          <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-8 h-8 justify-center items-center">
            <Ionicons name="checkmark-circle" size={16} color="white" />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {/* Price/Status banner */}
      <View className="items-center my-2">
        {!isPlaceholderBuddy && <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
          <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
            {isOwned
              ? isSelected
                ? t("shop.selected", "Selected")
                : t("shop.owned", "Owned")
              : t("shop.balance", { coins: userCoins || 0 })}
          </Text>
          {!isOwned && <CoinIcon width={18} height={18} />}
        </View>}
      </View>

      {/* Name + description */}
      <View className="items-center my-4">
        <Text
          className={`text-2xl font-bold text-center ${
            isDark ? "text-slate-100" : "text-indigo-950"
          }`}
        >
          {buddy?.name}
        </Text>
        <Text
          className={`text-sm text-center mb-4 ${
            isDark ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {buddy?.description ||
            t("shop.description", "A great companion for your quit journey.")}
        </Text>
      </View>

      {/* Card Content */}
      <View className={`h-72 my-4 rounded-3xl justify-center bg-center items-center overflow-hidden relative ${isDark ? 'bg-slate-700/50' : 'bg-indigo-50/50'}`}>

        {/* Buddy Preview */}
        {renderBuddyVisual()}
         <View className="absolute top-3 right-3 z-10 rounded-3xl bg-black/40 p-1.5">
            <LockLight width={12} height={12} color="white"  />
        </View>
      </View>
    </>
  );
};

export default BuddyModalContent;
