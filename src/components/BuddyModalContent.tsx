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

  const renderBuddyVisual = () => {
    if (lottieSource) {
      return (
        <View className="w-32 h-32 relative justify-center items-center">
          <LottieView
            source={lottieSource}
            autoPlay
            loop
            style={{ width: 144, height: 144, transform: [{ scale: 2 }] }}
            resizeMode="contain"
            enableMergePathsAndroidForKitKatAndAbove
          />

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
    }

    if (isImageIcon) {
      return (
        <View className="w-32 h-32 relative justify-center items-center">
          <Image source={buddy?.icon} className="w-36 h-36" resizeMode="contain" />
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
    }

    // Nothing resolvable: render empty spacer
    return <View className="w-32 h-32" />;
  };

  return (
    <>
      {/* Price/Status banner */}
      <View className="items-center my-2">
        <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
          <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
            {isOwned
              ? isSelected
                ? t("shop.selected", "Selected")
                : t("shop.owned", "Owned")
              : t("shop.balance", { coins: userCoins || 0 })}
          </Text>
          {!isOwned && <CoinIcon width={18} height={18} />}
        </View>
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

      {/* Card */}
      <View
        className={`gap-4 rounded-3xl p-8 justify-center items-center ${
          isDark ? "bg-slate-700/50" : "bg-indigo-50/50"
        }`}
      >
        <View className="items-center my-8 py-8">{renderBuddyVisual()}</View>
      </View>
    </>
  );
};

export default BuddyModalContent;
