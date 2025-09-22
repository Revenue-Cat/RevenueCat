// src/components/ReviewModal.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Linking, Image } from "react-native";
import SlideModal from "./SlideModal";
import Star from "../assets/star.svg";
import StarFilled from "../assets/star-f.svg";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
// If you moved these constants into coin_packs.ts, change the import accordingly.
import { APP_STORE_REVIEW_URL } from "../config/subscriptions";
import ReviewArt from "../assets/review-image.png";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (stars: number) => void;
  appReviewUrl?: string;
};

const ICON_SIZE = 40;

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
      const url = appReviewUrl || APP_STORE_REVIEW_URL;
      console.log('Opening App Store URL:', url);
      const canOpen = await Linking.canOpenURL(url);
      console.log('Can open URL:', canOpen);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.log('Cannot open URL, trying alternative');
        await Linking.openURL('https://apps.apple.com/app/id6751299071');
      }
    } catch (error) {
      console.log('Error opening App Store:', error);
      // Fallback to web URL
      try {
        await Linking.openURL('https://apps.apple.com/app/id6751299071');
      } catch (fallbackError) {
        console.log('Fallback also failed:', fallbackError);
      }
    }
  };

  const submit = async (value: number) => {
    onSubmit?.(value);
    await openReview();
  };

  const titleColor = isDark ? "text-white" : "text-indigo-950";

  return (
    // Omit title prop so we can place the image above our custom title
    <SlideModal visible={visible} onClose={onClose}>
      <View className="items-center">
        {/* Top illustration */}
        <Image
          source={ReviewArt}
          resizeMode="contain"
          style={{ width: 316, height: 126, marginTop: 4 }}
        />

        {/* Title */}
        <Text
          className={`mt-2 text-center font-extrabold ${titleColor}`}
          style={{ fontSize: 22, lineHeight: 28 }}
        >
          {t("review.title", "How satisfied are you with\nQutQly App?")}
        </Text>

        {/* Stars */}
        <View style={{ flexDirection: "row", marginTop: 18 }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const Filled = i < rating;
            const Icon = Filled ? StarFilled : Star;
            return (
              <Pressable
                key={i}
                onPress={() => {
                  const next = i + 1;
                  setRating(next);
                  submit(next);
                }}
                style={{ marginHorizontal: 8 }}
              >
                {/* clip any stray paths in the SVG */}
                <View
                  style={{
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    overflow: "hidden",
                  }}
                >
                  <Icon
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SlideModal>
  );
};

export default ReviewModal;
