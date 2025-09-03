// src/components/PromoCards.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Share, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import ReviewModal from "./ReviewModal";
import Coins from "../assets/coins.svg";
import BuddyReview from "../assets/buddy-review.svg";
import { APP_SHARE_URL } from "../config/subscriptions";

type Props = {
  onShared?: () => void;
  onReviewed?: (stars: number) => void;
  onOpenReview: () => void;
};

const PromoCards: React.FC<Props> = ({
  onShared,
  onReviewed,
  onOpenReview,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  const shareLink = async () => {
    try {
      await Share.share({
        message:
          t(
            "promos.share.message",
            "Join me on Zero Poofs — my favorite quit-smoking buddy app!"
          ) + `\n${APP_SHARE_URL}`,
        url: APP_SHARE_URL,
        title: t("promos.share.title", "Zero Poofs"),
      });
      onShared?.();
    } catch {}
  };

  return (
    <View className="px-4">
      {/* Refer a friend card */}
      {/* <View className="rounded-3xl overflow-hidden">
        <LinearGradient
          colors={["#7C8CF8", "#6A55E4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mx-4 rounded-3xl mt-4 overflow-hidden"
        >
          <View className="px-5 py-5 relative pr-32 min-h-[128px]">
            <View className="flex-row items-center justify-between">
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text className="text-white/90 font-semibold text-s">
                  {t("promos.refer.subtitle", "Quitting is easier together")}
                </Text>
                <Text className="text-white font-bold text-base mt-1">
                  {t("promos.refer.title", "Get 500 coins by referring")}
                </Text>

                <Pressable
                  onPress={shareLink}
                  className="self-start bg-white/20 rounded-3xl px-4 py-2 mt-4"
                >
                  <Text className="text-white font-bold text-sm">
                    {t("promos.refer.cta", "Refer a friend")}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View
              pointerEvents="none"
              style={{ position: "absolute", right: 12, bottom: -4 }}
            >
              <Coins width={128} height={128} />
            </View>
          </View>
        </LinearGradient>
      </View> */}

      {/* Review card */}
      <View className="mt-4 rounded-3xl overflow-hidden">
        <LinearGradient
          colors={["#8DB0FF", "#F07AC2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="px-5 py-5 relative pr-32 min-h-[128px]">
            <View className="flex-row items-center justify-between">
              <View style={{ paddingRight: 16 }}>
                <Text className="text-white/90 font-semibold text-s">
                  {t(
                    "promos.review.subtitle",
                    "Help us grow with a quick 5★ review"
                  )}
                </Text>
                <Text className="text-white font-bold text-base mt-1">
                  {t("promos.review.title", "We’re a small creative team!")}
                </Text>

                <Pressable
                  onPress={onOpenReview}
                  className="self-start bg-white/20 rounded-3xl px-4 py-2 mt-4"
                >
                  <Text className="text-white font-bold text-sm">
                    {t("promos.review.cta", "Give us a 5-star")}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Artwork anchored to corner; slight overflow to match screenshot */}
            <View
              pointerEvents="none"
              style={{ position: "absolute", right: -6, bottom: -8 }}
            >
              <BuddyReview width={136} height={136} />
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default PromoCards;
