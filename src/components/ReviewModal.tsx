// src/components/ReviewModal.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Linking } from "react-native";
import SlideModal from "./SlideModal";
import Star from "../assets/star.svg";
import StarFilled from "../assets/star-f.svg";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { APP_STORE_REVIEW_URL } from "../config/subscriptions";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (stars: number) => void;
  appReviewUrl?: string;
};

const ReviewModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  appReviewUrl,
}) => {
  const [rating, setRating] = useState(1);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  const openReview = async () => {
    try {
      await Linking.openURL(appReviewUrl || APP_STORE_REVIEW_URL);
    } catch {}
  };

  const submit = async () => {
    onSubmit?.(rating);
    await openReview();
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t("review.title", "How satisfied are you with\nQutQly App?")}
    >
      <View className="items-center">
        <View className="flex-row items-center justify-center gap-2 mt-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const Icon = i < rating ? StarFilled : Star;
            return (
              <Pressable
                key={i}
                onPress={() => {
                  setRating(i + 1);
                  submit();
                }}
              >
                <Icon width={34} height={34} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </SlideModal>
  );
};

export default ReviewModal;
