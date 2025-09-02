// src/components/BuddyModalActions.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

interface BuddyModalActionsProps {
  buddy: any;
  userCoins: number;
  onPurchase: () => void;
  onClose: () => void;
}

const BuddyModalActions: React.FC<BuddyModalActionsProps> = ({
  buddy,
  userCoins,
  onPurchase,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const { ownedBuddies, selectedBuddyId, setSelectedBuddyId } = useApp();

  const isOwned = ownedBuddies?.includes(buddy.id) || false;
  const isSelected = selectedBuddyId === buddy.id;
  const canAfford = userCoins >= (buddy.coin || 0);

  const handleSelect = () => {
    if (isOwned) {
      setSelectedBuddyId(buddy.id);
      onClose();
    }
  };

  const handlePurchase = () => {
    if (canAfford && !isOwned) {
      onPurchase();
      // Parent decides whether to close
    }
  };

  return (
    <View className="my-6 flex-row justify-center gap-4">
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
          className={`text-2xl rounded-2xl px-4 py-2 font-bold ${
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

      {/* Purchase Button - Only if not owned */}
      {!isOwned && (
        <Pressable
          className={`flex-1 rounded-2xl px-6 py-4 items-center justify-center flex-row ${
            canAfford ? "bg-indigo-600" : "bg-gray-400"
          }`}
          onPress={handlePurchase}
          disabled={!canAfford}
          accessibilityRole="button"
          accessibilityLabel={
            canAfford
              ? t("shop.buyFor", { coins: buddy.coin })
              : t("shop.purchase", "Purchase")
          }
        >
          <Text
            className={`font-semibold text-xl ${
              canAfford ? "text-white" : "text-gray-200"
            }`}
          >
            {canAfford
              ? t("shop.buyFor", { coins: buddy.coin })
              : t("shop.purchase", "Purchase")}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default BuddyModalActions;
