// src/components/PromoCards.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Share, Modal, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import ReviewModal from "./ReviewModal";
import ReviewBannerImage from "../assets/review-banner-image.png";
import Coins from "../assets/icons/coins.svg";
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
      <View className="mt-4 bg-indigo-50 rounded-2xl p-5">
        {/* Top illustration */}
        <Image
          source={ReviewBannerImage}
          resizeMode="contain"
          style={{ width: 280 }}
        />

        {/* Title */}
        <Text className="text-xl font-bold text-indigo-950 text-center">
          {t("review.title", "Leave feedback")}
        </Text>

        {/* Description */}
        <Text className="text-s text-slate-850 text-center mt-2">
          {t(
            "review.description",
            "We're a small creative team! Help us grow by leaving a quick 5★ review. Your support means a lot and keeps us creating more for you!"
          )}
        </Text>

        {/* Feedback Button */}
        <Pressable
          onPress={onOpenReview}
          className="w-full h-[52px] bg-indigo-600 rounded-2xl justify-center items-center mt-4"
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-white font-bold text-xl mr-2">
              {t("review.button", "Feedback")} +150
            </Text>
            <Coins width={20} height={20} />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default PromoCards;
