import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import SlideModal from "./SlideModal";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import CoinIcon from "../assets/icons/coins.svg";
import CoinPackCard from "./CoinPackCard";
import { COIN_PACKS, CoinPack } from "../config/subscriptions";
import Purchases from "react-native-purchases";

const CoinPurchaseModal: React.FC = () => {
  const { showCoinPurchase, setShowCoinPurchase, userCoins, addTransaction, refreshCoinsBalance } =
    useApp();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  // Localize labels/captions/bonus tags
  const packs = COIN_PACKS.map((p) => ({
    ...p,
    label: t(`coinPacks.${p.id}.label`, p.label),
    caption: p.caption
      ? t(`coinPacks.${p.id}.caption`, p.caption)
      : undefined,
    bonusTag: p.bonusTag
      ? t(`coinPacks.${p.id}.bonus`, p.bonusTag)
      : undefined,
  }));

  const handleBuy = async (pack: CoinPack) => {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      if (!currentOffering) {
        throw new Error("No current offering available");
      }
      const rcPackage = currentOffering.availablePackages.find(
        (p) => p.identifier === pack.id
      );
      if (!rcPackage) {
        throw new Error(`No package found with identifier ${pack.id}`);
      }
      console.log("--------------", rcPackage, currentOffering.availablePackages)
      const { customerInfo } = await Purchases.purchasePackage(rcPackage);
      addTransaction(0, `Coins purchase ${rcPackage?.product?.identifier}, ${rcPackage?.product?.priceString},  ${rcPackage?.product?.description}`)
      // Purchase successful, update virtual currency balance
      await refreshCoinsBalance()
      setShowCoinPurchase(false);
    } catch (error: any) {
      console.log("-----------error", error)
      if (error.userCancelled) {
        // User cancelled the purchase, do nothing
      } else {
        console.error("Error during purchase:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  return (
    <SlideModal
      visible={showCoinPurchase}
      onClose={() => setShowCoinPurchase(false)}
    >
      {/* Balance pill (centered) */}
      <View className="items-center mt-1 mb-2">
        <View className="flex-row items-center rounded-full px-3.5 py-1.5 border border-amber-400">
          <Text className="mr-2 font-bold text-amber-500">
            {t("coinModal.balance", "Balance")} {userCoins}
          </Text>
          <CoinIcon width={16} height={16} />
        </View>
      </View>

      {/* Title + subtitle */}
      <View className="items-center mt-1 mb-4">
        <Text
          className={`font-extrabold text-[20px] ${
            isDark ? "text-slate-100" : "text-indigo-950"
          }`}
        >
          {t("coinModal.title", "Get More Coins")}
        </Text>
        <Text
          className={`mt-1 text-sm font-medium ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t("coinModal.subtitle", "Choose your pack and keep going!")}
        </Text>
      </View>

      {/* Pack cards */}
      <View className="px-2">
        {packs.map((p) => (
          <CoinPackCard key={p.id} pack={p} onPress={handleBuy} />
        ))}
      </View>
    </SlideModal>
  );
};

export default CoinPurchaseModal;