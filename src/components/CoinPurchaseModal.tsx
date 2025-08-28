import React from "react";
import { View, Text } from "react-native";
import SlideModal from "./SlideModal";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import CoinIcon from "../assets/icons/coins.svg";
import CoinPackCard from "./CoinPackCard";
import { COIN_PACKS, CoinPack } from "../config/subscriptions";

const CoinPurchaseModal: React.FC = () => {
  const { showCoinPurchase, setShowCoinPurchase, userCoins, setUserCoins } = useApp();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  const indigo950 = "#1E1B4B";
  const slate100 = "#F1F5F9";
  const slate500 = "#64748B";
  const amber500 = "#F59E0B";
  const amberBorder = "#FBBF24";

  const titleColor = isDark ? slate100 : indigo950;
  const subColor = isDark ? slate500 : slate500;

  // localized packs (labels/captions can be overridden via i18n)
  const packs = COIN_PACKS.map((p) => ({
    ...p,
    label: t(`coinPacks.${p.id}.label`, p.label),
    caption: p.caption ? t(`coinPacks.${p.id}.caption`, p.caption) : undefined,
    bonusTag: p.bonusTag ? t(`coinPacks.${p.id}.bonus`, p.bonusTag) : undefined,
  }));

  const handleBuy = (pack: CoinPack) => {
    setUserCoins(userCoins + pack.coins);
    setShowCoinPurchase(false);
  };

  return (
    <SlideModal
      visible={showCoinPurchase}
      onClose={() => setShowCoinPurchase(false)}
    >
      {/* Balance centered */}
      <View style={{ alignItems: "center", marginTop: 4, marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderWidth: 1.5,
            borderColor: amberBorder,
            backgroundColor: "rgba(251, 191, 36, 0.15)",
          }}
        >
          <Text style={{ color: indigo950, fontWeight: "700", marginRight: 8 }}>
            {t("coinModal.balance", "Balance")} {userCoins}
          </Text>
          <CoinIcon width={16} height={16} />
        </View>
      </View>

      {/* Heading + subheading */}
      <View style={{ alignItems: "center", marginTop: 4, marginBottom: 16 }}>
        <Text
          style={{
            color: titleColor,
            fontWeight: "800",
            fontSize: 20,
            marginBottom: 6,
          }}
        >
          {t("coinModal.title", "Get More Coins")}
        </Text>
        <Text style={{ color: subColor, fontSize: 14, fontWeight: "500" }}>
          {t("coinModal.subtitle", "Choose your pack and keep going!")}
        </Text>
      </View>

      {/* Packs */}
      <View style={{ paddingHorizontal: 8 }}>
        {packs.map((p) => (
          <CoinPackCard key={p.id} pack={p} onPress={handleBuy} />
        ))}
      </View>
    </SlideModal>
  );
};

export default CoinPurchaseModal;
