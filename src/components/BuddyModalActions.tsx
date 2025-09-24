// src/components/BuddyModalActions.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import CoinIcon from '../assets/icons/coins.svg';
interface BuddyModalActionsProps {
  buddy: any;
  userCoins: number;
  onPurchase: () => void;
  onClose: () => void;
  hidePurchaseButton?: boolean;
}

const BuddyModalActions: React.FC<BuddyModalActionsProps> = ({
  buddy,
  userCoins,
  onPurchase,
  onClose,
  hidePurchaseButton = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const { ownedBuddies, selectedBuddyId, setSelectedBuddyId } = useApp();

  const isOwned = ownedBuddies?.includes(buddy.id) || false;
  const isSelected = selectedBuddyId === buddy.id;
  const canAfford = userCoins >= (buddy.coin || 0);

  const handleSelect = () => {
      setSelectedBuddyId(buddy.id);
      onClose();
  };

  const handlePurchase = () => {
      // Close BuddyModal first to prevent blink
      onClose();
      // Then trigger purchase (which may open coin purchase modal)
      onPurchase();
  };

  return (
    <View
      className={`${
        isDark ? "bg-dark-background" : "bg-light-background"
      }`}
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
          onPress={onClose}
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

        {/* Select Button - Only if owned and not already selected */}
        {isOwned && !isSelected && (
          <Pressable
            className="flex-1 rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600"
            onPress={handleSelect}
            accessibilityRole="button"
            accessibilityLabel={t("shop.select", "Select")}
          >
            <Text className="font-semibold text-xl text-white">
              {t("shop.select", "Select")}
            </Text>
          </Pressable>
        )}

        {/* Purchase Button - Only if not owned and not hidden */}
        {!isOwned && !hidePurchaseButton && (
          <Pressable
            className={`flex-1 rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600`}
            onPress={handlePurchase}
            accessibilityRole="button"
            accessibilityLabel={
              canAfford
                ? t("shop.buyFor", { coins: buddy.coin })
                : t("shop.purchase", "Purchase")
            }
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className={`font-semibold text-xl text-white`}>{t("shop.buyFor", { coins: buddy.coin })}</Text>
              <CoinIcon width={20} height={20} className="ml-1" />
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default BuddyModalActions;
