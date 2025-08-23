// src/screens/Profile.tsx
import React, { useRef, useMemo } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";
import ParallaxBackground from "../components/ParallaxBackground";

// custom icons
import EditLight from "../assets/icons/edit.svg";
import EditDark from "../assets/icons/edit-d.svg";
import PrevLight from "../assets/icons/prev.svg";
import PrevDark from "../assets/icons/prev-d.svg";

interface ProfileProps {
  onBack: () => void;
  onNavigateToAchievements: () => void; // kept to avoid breaking callers
  onNavigateToShop: () => void; // kept to avoid breaking callers
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const isDark = true;

  // icons + colors per theme
  const EditIcon = isDark ? EditDark : EditLight;
  const PrevIcon = isDark ? PrevDark : PrevLight;
  const iconColor = isDark ? "#FFFFFF" : "#1e1b4b";

  const { gender, selectedBuddyId, buddyName, openShopWithTab } = useApp();

  // buddy sprite (foreground)
  const sexKey: SexKey = gender === "lady" ? "w" : "m";
  const buddySource = useMemo(
    () => buddyAssets[selectedBuddyId as BuddyKey][sexKey],
    [selectedBuddyId, sexKey]
  );

  // label
  const genderLabel =
    gender === "lady" ? "Woman" : gender === "man" ? "Man" : "Non-binary";

  // parallax driver
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-800" : "bg-white"}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-3">
        <Pressable
          className={`w-10 h-10 rounded-full justify-center items-center p-1 ${
            isDark ? "bg-slate-500" : "bg-slate-100"
          }`}
          onPress={onBack}
          hitSlop={10}
          style={({ hovered }) => [
            isDark
              ? {
                  backgroundColor: hovered
                    ? "#475569" /* slate-600 */
                    : "#334155" /* slate-700 */,
                }
              : {
                  backgroundColor: hovered
                    ? "#e0e7ff" /* indigo-100 */
                    : "#f8fafc" /* slate-50 */,
                },
            isDark ? { elevation: 2 } : null,
          ]}
        >
          <PrevIcon width={18} height={18} color={iconColor} />
        </Pressable>
        <Text
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-indigo-950"
          }`}
        >
          Profile
        </Text>
        <View style={{ width: 40, height: 40 }} />
      </View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Buddy card — h=231, radius=24, bg per theme */}
        <View
          className={`mx-4 rounded-3xl ${
            isDark ? "bg-slate-700" : "bg-indigo-50"
          }`}
          style={{ height: 231 }}
        >
          {/* Scenic parallax window — h=143, radius=24 */}
          <View className="rounded-3xl overflow-hidden" style={{ height: 143 }}>
            <ParallaxBackground scrollY={scrollY} height={143} anchor="middle">
              {/* Buddy over the parallax; scale = 0.5 */}
              <View
                pointerEvents="box-none"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -18,
                  height: 143,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Animated.Image
                  source={buddySource}
                  resizeMode="contain"
                  style={{
                    width: "100%",
                    height: 143,
                    zIndex: 21,
                    transform: [{ scale: 1.3 }],
                  }}
                />
              </View>

              {/* Edit button (dark: slate-500 bg + white icon) */}
              <Pressable
                onPress={() => openShopWithTab("characters")}
                className={`w-10 h-10 rounded-full z-[41] justify-center items-center absolute right-3 top-3 p-1 ${
                  isDark ? "bg-slate-500" : "bg-indigo-100"
                }`}
                hitSlop={10}
                style={({ hovered }) => [
                  isDark
                    ? {
                        backgroundColor: hovered
                          ? "#475569" /* slate-600 */
                          : "#334155" /* slate-700 */,
                      }
                    : {
                        backgroundColor: hovered
                          ? "#e0e7ff" /* indigo-100 */
                          : "#f8fafc" /* slate-50 */,
                      },
                  isDark ? { elevation: 2 } : null,
                ]}
              >
                <EditIcon width={18} height={18} color={iconColor} />
              </Pressable>
            </ParallaxBackground>
          </View>

          {/* Name + gender */}
          <View className="mt-5 items-center">
            <Text
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-indigo-950"
              }`}
              numberOfLines={1}
            >
              {buddyName || "Buddy"}
            </Text>
            <Text
              className={`text-base font-medium ${
                isDark ? "text-slate-300" : "text-slate-500"
              }`}
            >
              {genderLabel}
            </Text>
          </View>
        </View>

        {/* ---- everything else intentionally commented ---- */}
        {/*
        <View className="px-4 mt-4">
          <View className="rounded-3xl bg-slate-50 p-6">
            ...
          </View>
        </View>
        */}
      </Animated.ScrollView>
    </View>
  );
};

export default Profile;
