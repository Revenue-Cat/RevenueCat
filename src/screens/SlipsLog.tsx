import React, { useCallback, useMemo } from "react";
import { View, Text, Pressable, ScrollView, Alert, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import SmokeIcon from "../assets/icons/smoke.svg";
import CoinIcon from "../assets/icons/coins.svg";
import SmokingDog from "../assets/smoking-dog.png";
import ProtectDog from "../assets/protect-dog.png";
import { SLIPS_CONFIG } from "../config/subscriptions";

type Props = { onBack: () => void; handleISmoked: () => void };

const formatDateShort = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const SlipsLog: React.FC<Props> = ({ onBack }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  const {
    slipsUsed,
    slipsDates,
    getSlipsAllowed,
    shouldOfferProtectStreak,
    addSlip,
    purchaseExtraSlips,
    setShowCoinPurchase,
    userCoins,
  } = useApp();

  const allowed = getSlipsAllowed();
  const remaining = Math.max(allowed - slipsUsed, 0);

  const grid = useMemo(() => {
    const used = slipsDates.slice(0, allowed);
    const blanks = Array.from(
      { length: Math.max(allowed - used.length, 0) },
      () => null
    );
    return [...used, ...blanks];
  }, [slipsDates, allowed]);

  const onPressISmoked = () => {
    const res = addSlip();
    if (res === "limit") {
      Alert.alert(
        t("slipsLog.limit.title", "Don't give up"),
        t(
          "slipsLog.limit.body",
          "You've reached your slip limit. Protect your streak to add +5, or reset your timer."
        )
      );
    }
  };

  const onBuy = async () => {
    const cost = SLIPS_CONFIG.extraPack.coins;
    const ok = await purchaseExtraSlips(cost);
    if (!ok) {
      Alert.alert(
        t("slipsLog.buy.notEnough.title"),
        t("slipsLog.buy.notEnough.body", { coins: cost })
      );
    }
  };

  const handleCoinPurchase = useCallback(() => {
    setShowCoinPurchase(true);
  }, [setShowCoinPurchase]);

  // Colors
  const cardBg = isDark ? "bg-slate-700" : "bg-indigo-50";
  const titleColor = isDark ? "text-slate-100" : "text-indigo-950";
  const bodyMuted = isDark ? "text-slate-300" : "text-slate-600";
  const paragraphColor = isDark ? "text-slate-200" : "text-slate-800";
  const limitColor = isDark ? "text-slate-400" : "text-slate-500";

  const tileActiveBg = isDark ? "bg-red-900/30" : "bg-red-100";
  const tileActiveFg = isDark ? "#f87171" : "#ef4444";
  const tileInactiveBg = isDark ? "bg-slate-600/50" : "bg-slate-100";
  const tileInactiveText = "text-slate-400";

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-background" : "bg-white"}`}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={onBack}
          className={`w-10 h-10 rounded-full justify-center items-center ${
            isDark ? "bg-slate-600" : "bg-slate-100"
          }`}
          hitSlop={10}
        >
          <Text
            className={`${
              isDark ? "text-slate-200" : "text-indigo-900"
            } text-lg`}
          >
            ←
          </Text>
        </Pressable>

        <Text className={`${titleColor} text-xl font-bold`}>
          {t("slipsLog.title", "Slips log")}
        </Text>

        <Pressable
          className={`rounded-full px-3 py-1 flex-row items-center ${
            isDark ? "bg-amber-300/20" : "bg-yellow-200"
          }`}
          onClick={handleCoinPurchase}
        >
          <CoinIcon width={16} height={16} />
          <Text className="ml-1 text-yellow-800 font-semibold">
            {userCoins}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-4"
      >
        {/* Main summary card */}
        <View className={`${cardBg} rounded-3xl p-5 mt-2`}>
          <View className="items-center">
            <Image
              source={SmokingDog}
              resizeMode="contain"
              style={{
                width: 220,
                height: 120,
                borderRadius: 24,
                transform: [{ scale: 1.3 }],
              }}
            />
          </View>

          <View className="mt-3 items-center">
            <Text className="text-red-500 text-5xl font-bold">
              {slipsUsed}
              <Text className={`${limitColor} text-lg font-semibold`}>
                {" "}
                / {allowed} {t("slipsLog.counter.times", "times")}
              </Text>
            </Text>
          </View>

          <Text
            className={`${paragraphColor} text-m font-normal text-center mt-3`}
          >
            {t(
              "slipsLog.summary",
              "You have {{remaining}} slips allowed. If you reach the limit, your smoke-free timer resets — and you can start fresh",
              { remaining }
            )}
          </Text>
        </View>

        {/* Grid */}
        <View className="mt-4 flex-row flex-wrap">
          {grid.map((isoOrNull, i) => {
            const isUsed = !!isoOrNull;
            return (
              <View
                key={i}
                style={{
                  width: 82,
                  height: 76,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <View
                  className={`rounded-xl items-center justify-center ${
                    isUsed ? tileActiveBg : tileInactiveBg
                  }`}
                  style={{ width: 82, height: 76 }}
                >
                  <SmokeIcon
                    width={24}
                    height={24}
                    color={isUsed ? tileActiveFg : "#94a3b8"}
                  />
                  <Text
                    className={`mt-2 text-m font-medium ${
                      isUsed ? "text-red-500" : tileInactiveText
                    }`}
                  >
                    {isUsed
                      ? formatDateShort(isoOrNull as string)
                      : t("slipsLog.freeSlip", "Free Slip")}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Protect your streak card */}
        {shouldOfferProtectStreak() && (
          <View className={`${cardBg} rounded-3xl p-6 mt-6`}>
            <View className="items-center">
              <Image
                source={ProtectDog}
                resizeMode="contain"
                style={{ width: 220, height: 120, borderRadius: 24 }}
              />
            </View>

            <Text
              className={`${
                isDark ? "text-slate-100" : "indigo-900"
              } text-5xl font-bold text-center mt-1`}
            >
              +5
            </Text>
            <Text
              className={`${
                isDark ? "text-slate-100" : "indigo-950"
              } text-xl font-bold text-center mt-1`}
            >
              {t("slipsLog.protect.title", "Protect your streak")}
            </Text>
            <Text
              className={`${paragraphColor} text-m font-normal text-center mt-2`}
            >
              {t(
                "slipsLog.protect.body",
                "Use coins to get extra slips so your smoke-free timer won’t reset."
              )}
            </Text>

            <Pressable
              onPress={onBuy}
              className="mt-4 rounded-2xl px-5 py-4 items-center justify-center bg-indigo-600 flex-row"
            >
              <Text className="text-white font-semibold text-base mr-2">
                {t("slipsLog.buy.cta", { coins: SLIPS_CONFIG.extraPack.coins })}
              </Text>
              <CoinIcon width={18} height={18} />
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Bottom “I smoked” bar */}
      <View className="absolute bottom-4 left-4 right-4">
        <Pressable
          onPress={onPressISmoked}
          className="bg-red-500 rounded-2xl py-4 items-center shadow-lg flex-row justify-center"
        >
          <Text className="text-white font-bold text-lg mr-2">
            {t("slipsLog.smokedButton", "I smoked")}
          </Text>
          <SmokeIcon width={24} height={24} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
};

export default SlipsLog;
