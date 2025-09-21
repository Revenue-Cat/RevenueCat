import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import SlideModal from "./SlideModal";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import CoinIcon from "../assets/icons/coins.svg";
import CoinPackCard from "./CoinPackCard";
import { COIN_PACKS, CoinPack } from "../config/subscriptions";
import Purchases from "react-native-purchases";
import LottieView from "lottie-react-native";

const CoinPurchaseModal: React.FC = () => {
  const { showCoinPurchase, setShowCoinPurchase, userCoins, addTransaction, refreshCoinsBalance } =
    useApp();
  const [isLoading, setIsLoading] = useState(false)
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

  const [selectedPack, setSelectedPack] = useState<CoinPack | null>(packs[0] || null)

  const handleBuy = async () => {
    if (!selectedPack) return;
    
    try {
      setIsLoading(true)
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      if (!currentOffering) {
        throw new Error("No current offering available");
      }
      const rcPackage = currentOffering.availablePackages.find(
        (p) => p.identifier === selectedPack.id
      );
      if (!rcPackage) {
        throw new Error(`No package found with identifier ${selectedPack.id}`);
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
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <SlideModal
      visible={showCoinPurchase}
      onClose={() => setShowCoinPurchase(false)}
      showCloseButton={false}
    >
      {isLoading ? (  
          <View
            className={`flex-1 justify-center items-center ${
              theme === "dark" ? "bg-dark-background" : "bg-light-background"
            }`}
          >
            <LottieView
              source={require("../../src/assets/Loadercat.json")}
              autoPlay
              loop
              style={{
                width: Dimensions.get("window").width * 0.8,
                height: 200,
                alignSelf: "center",
              }}
            />
          </View>
        ) : (
          <>
            <View className="items-center mt-1 mb-2">
              <View className="flex-row items-center rounded-full px-3.5 py-1.5 border border-amber-400">
                <Text className="mr-2 font-bold text-amber-500">
                  {t("coinModal.balance", "Balance")} {userCoins}
                </Text>
                <CoinIcon width={16} height={16} />
              </View>
            </View>

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

            <View className="px-2">
              {packs.map((p) => (
                <CoinPackCard 
                  key={p.id} 
                  pack={p} 
                  onPress={() => setSelectedPack(p)} 
                  isSelected={selectedPack?.id === p.id}
                />
              ))}
            </View>
          </>
        )
      }
      {/* Actions Button - Only show when not loading (Apple ID modal not open) */}
      {!isLoading && (
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            marginHorizontal: -40,
            marginBottom: -40,
            paddingBottom: 40,
            paddingHorizontal: 40,
            paddingVertical: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <View className="flex-row justify-center gap-2">
            {/* Close Button */}
            <Pressable
              className={`w-15 h-15 rounded-2xl justify-center items-center ${
                isDark ? "bg-slate-700" : "bg-indigo-50"
              }`}
              onPress={() => setShowCoinPurchase(false)}
              accessibilityRole="button"
              accessibilityLabel={t("common.close", "Close")}
            >
              <Text
                className={`text-2xl rounded-2xl px-5 py-3 font-bold ${
                  isDark ? "text-slate-100 bg-slate-700" : "text-indigo-900 bg-indigo-50"
                }`}
              >
                ✕
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600"
              onPress={handleBuy}
              accessibilityRole="button"
              accessibilityLabel={t("shop.buyCoins", "Buy coins")}
            >
              <Text className="font-semibold text-xl text-white">
                {t("shop.buyCoins", "Buy coins")}
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      )}
    </SlideModal>
  );
};

export default CoinPurchaseModal;