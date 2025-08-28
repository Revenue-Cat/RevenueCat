import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import CoinIcon from "../assets/icons/coins.svg";
import type { CoinPack } from "../config/subscriptions";

type Props = {
  pack: CoinPack;
  onPress: (pack: CoinPack) => void;
};

const CoinPackCard: React.FC<Props> = ({ pack, onPress }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Colors (tailwind palette equivalents)
  const indigo600 = "#4F46E5";
  const indigo50 = "#EEF2FF";
  const slate100 = "#F1F5F9";
  const slate300 = "#CBD5E1";
  const slate500 = "#64748B";
  const indigo950 = "#1E1B4B";
  const amber500 = "#F59E0B";

  const cardBg = isDark ? "#374151" /* gray-700 */ : indigo50;

  // Highlight only if this pack has a bonus AND is marked featured
  const showHighlight = !!pack.bonusTag && !!pack.featured;

  return (
    <Pressable
      onPress={() => onPress(pack)}
      style={{
        borderRadius: 24,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        backgroundColor: cardBg,
        borderWidth: showHighlight ? 2 : 0,
        borderColor: showHighlight ? indigo600 : "transparent",
      }}
    >
      {/* Bonus badge (only for highlighted/featured pack) */}
      {showHighlight && (
        <View
          style={{
            position: "absolute",
            left: 24,
            top: -12,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: indigo600, // requested
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12 }}>
            {pack.bonusTag}
          </Text>
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left */}
        <View>
          {/* Label + coins */}
          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "nowrap" }}>
            <Text
              style={{
                color: isDark ? slate100 : indigo950,
                fontWeight: "700",
                fontSize: 18, // label 18 / bold
              }}
            >
              {pack.label}{" "}
            </Text>

            <Text
              style={{
                color: amber500, // coins color
                fontWeight: "700",
                fontSize: 18, // coins 18 / bold
              }}
            >
              +{pack.coins}{" "}
            </Text>

            <CoinIcon width={14} height={14} />
          </View>

          {/* Caption */}
          {!!pack.caption && (
            <Text
              style={{
                marginTop: 6,
                color: isDark ? slate300 : slate500, // caption color
                fontSize: 14, // caption size
                fontWeight: "400", // caption normal
              }}
              numberOfLines={1}
            >
              {pack.caption}
            </Text>
          )}
        </View>

        {/* Right */}
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              color: isDark ? slate100 : indigo950, // price color
              fontWeight: "700",
              fontSize: 20, // price 20 / bold
            }}
          >
            {pack.price.toFixed(2)} {pack.currency}
          </Text>

          {!!pack.oldPrice && (
            <Text
              style={{
                marginTop: 4,
                color: slate500, // old price color
                fontSize: 14, // old price size
                textDecorationLine: "line-through",
                fontWeight: "400", // normal
              }}
            >
              {pack.oldPrice.toFixed(1)} {pack.currency}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default CoinPackCard;
