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
  userCoins,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const { ownedBuddies, selectedBuddyId, gender } = useApp();

  const isOwned = ownedBuddies?.includes(buddy?.id) || false;
  const isSelected = selectedBuddyId === buddy?.id;

  // derive current user's sex key from profile (fallback to 'm')
  const sexFromProfile: SexKey = gender === "lady" ? "w" : "m";

  /** Map legacy ids (e.g., "llama-boy", "bulldog-girl") to buddyAssets keys + sex. */
  const normalizeIdToBaseAndSex = (
    id: string | undefined
  ): { base: BuddyKey | null; sex: SexKey } => {
    if (!id) return { base: null, sex: sexFromProfile };

    const parts = id.split("-"); // e.g. "alpaca-m", "llama-boy", "bulldog-girl"
    let base = parts[0];
    let sex: SexKey = sexFromProfile;

    // Accept explicit suffixes
    const suffix = parts[1] || "";
    if (suffix === "m" || suffix === "w") sex = suffix as SexKey;
    if (suffix === "boy") sex = "m";
    if (suffix === "girl") sex = "w";

    // Legacy base name mapping
    if (base === "llama") base = "alpaca";
    if (base === "bulldog") base = "dog";

    if (["alpaca", "dog", "fox", "koala", "zebra"].includes(base)) {
      return { base: base as BuddyKey, sex };
    }
    return { base: null, sex };
  };

  /** Pick Lottie source from buddyAssets (falls back to null if missing). */
  const getLottieSource = () => {
    const { base, sex } = normalizeIdToBaseAndSex(buddy?.id);
    if (!base) return null;
    const pack = (buddyAssets as any)?.[base];
    const src = pack?.[sex];
    return src || null;
  };

  const lottieSource = getLottieSource();

  // Helper: render buddy animation or fallback PNG
  const renderBuddyVisual = () => {
    if (lottieSource) {
      return (
        <View className="w-32 h-32 relative justify-center items-center">
          {/* Animated buddy */}
          <LottieView
            source={lottieSource}
            autoPlay
            loop
            style={{ width: 144, height: 144, transform: [{ scale: 2 }] }}
            resizeMode="contain"
            enableMergePathsAndroidForKitKatAndAbove
          />

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
    }

    // Fallback: legacy PNG icon
    return (
      <View className="w-32 h-32 relative justify-center items-center">
        <Image
          source={buddy?.icon}
          className="w-36 h-36"
          resizeMode="contain"
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
              : t("shop.balance", { coins: buddy?.coin || 0 })}
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
