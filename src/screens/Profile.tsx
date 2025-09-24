// src/screens/Profile.tsx
import React, { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";

import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { calculateSavings } from "../utils/savingsCalculator";

import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";
import ParallaxBackground from "../components/ParallaxBackground";
import LanguageSlide from "../components/LanguageSlide";
import SideModal from "../components/SideModal";
import SupportSlide from "../components/SupportSlide";

// custom icons
import EditLight from "../assets/icons/edit.svg";
import EditDark from "../assets/icons/edit-d.svg";
import PrevLight from "../assets/icons/prev.svg";
import PrevDark from "../assets/icons/prev-d.svg";
import NotificationLight from "../assets/icons/notification.svg";
import NotificationDark from "../assets/icons/notification-d.svg";
import ThemeLight from "../assets/icons/theme.svg";
import ThemeDark from "../assets/icons/theme-d.svg";
import FeedbackLight from "../assets/icons/feedback.svg";
import FeedbackDark from "../assets/icons/feedback-d.svg";
import SupportLight from "../assets/icons/support.svg";
import SupportDark from "../assets/icons/support-d.svg";
import FlagEn from "../assets/icons/flag-en.svg";
import FlagEs from "../assets/icons/flag-es.svg";
import FlagUk from "../assets/icons/flag-uk.svg";
import PromoCards from "../components/PromoCards";
import { COIN_PACKS, CoinPack, Plan } from "../config/subscriptions";
import ReviewModal from "../components/ReviewModal";
import CoinPackCard from "../components/CoinPackCard";

interface ProfileProps {
  onBack: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToShop: () => void;
  onNavigateToSetup: () => void; // open Setup (fromProfile)
  onNavigateToBuddy: () => void; // open BuddySelection (with back)
}

type Side = "bright" | "dark";

const Profile: React.FC<ProfileProps> = ({
  onBack,
  onNavigateToBuddy,
  onNavigateToSetup,
  onNavigateToShop,
}) => {
  // theme
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // icons + colors per theme
  const EditIcon = isDark ? EditDark : EditLight;
  const PrevIcon = isDark ? PrevDark : PrevLight;
  const iconColor = isDark ? "#FFFFFF" : "#1e1b4b";
  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";

  const Icons = {
    Notification: isDark ? NotificationDark : NotificationLight,
    Theme: isDark ? ThemeDark : ThemeLight,
    Feedback: isDark ? FeedbackDark : FeedbackLight,
    Support: isDark ? SupportDark : SupportLight,
  };

  // language
  const { language } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const languages = [
    { code: "en", name: t("languages.english"), flag: FlagEn },
    { code: "es", name: t("languages.spanish"), flag: FlagEs },
    { code: "uk", name: t("languages.ukrainian"), flag: FlagUk },
  ] as const;
  const currentLanguage =
    languages.find((l) => l.code === language) || languages[0];

  // app state
  const {
    gender,
    selectedBuddyId,
    buddyName,
    smokeType,
    dailyAmount,
    packPrice,
    packPriceCurrency,
    goal,
    userCoins,
    setUserCoins,
    hasLeftReview,
    handleLeaveReview
  } = useApp();

  const sexKey: SexKey = gender === "lady" ? "w" : "m";
  const baseBuddyKey: BuddyKey = useMemo(() => {
    const id = selectedBuddyId as string;
    const base = id.split("-")[0] as BuddyKey;
    return (buddyAssets as Record<string, unknown>)[base]
      ? base
      : ("llama" as BuddyKey);
  }, [selectedBuddyId]);

  const buddySource = useMemo(() => {
    const pack = buddyAssets[baseBuddyKey];
    return pack[sexKey];
  }, [baseBuddyKey, sexKey]);

  // labels (localized)
  const genderLabel =
    gender === "lady"
      ? t("profile.gender.woman", "Woman")
      : gender === "man"
      ? t("profile.gender.man", "Man")
      : t("profile.gender.nonBinary", "Non-binary");

  // map to existing setup option labels for localization
  const goalText =
    {
      "quit-completely": t("setup.fields.goal.options.quit-completely"),
      "reduce-gradually": t("setup.fields.goal.options.reduce-gradually"),
      "save-money": t("setup.fields.goal.options.save-money"),
      "improve-health": t("setup.fields.goal.options.improve-health"),
      "gain-control": t("setup.fields.goal.options.gain-control"),
      "doesnt-matter": t("setup.fields.goal.options.doesnt-matter"),
    }[goal || "quit-completely"] ||
    t("setup.fields.goal.options.quit-completely");

  const smokeLabel =
    {
      cigarettes: t("setup.fields.smokeType.options.cigarettes"),
      "roll-your-own": t("setup.fields.smokeType.options.roll-your-own"),
      "tobacco-heater": t("setup.fields.smokeType.options.tobacco-heater"),
      vaping: t("setup.fields.smokeType.options.vaping"),
    }[smokeType || "cigarettes"] ||
    t("setup.fields.smokeType.options.cigarettes");

  const dailyLabel =
    {
      "1-5": t("setup.fields.dailyAmount.options.cigarettes.1-5"),
      "5-10": t("setup.fields.dailyAmount.options.cigarettes.5-10"),
      "11-15": t("setup.fields.dailyAmount.options.cigarettes.11-15"),
      "16-20": t("setup.fields.dailyAmount.options.cigarettes.16-20"),
      "21-30": t("setup.fields.dailyAmount.options.cigarettes.21-30"),
      "31-40": t("setup.fields.dailyAmount.options.cigarettes.31-40"),
    }[dailyAmount || "5-10"] || t("setup.fields.dailyAmount.options.cigarettes.5-10");

  // savings math
  const savings = calculateSavings(
    smokeType || 'cigarettes',
    dailyAmount || '6-10',
    packPrice || '5',
    packPriceCurrency || '$',
    365
  );
  const savingsText = `${packPriceCurrency || "$"}${Math.round(savings.moneySaved)}`;

  // localized habits line
  const habitsLine = t(
    "profile.habits.line",
    "I smoke {{smokeType}}, usually {{dailyAmount}} a day. A pack costs me around {{currency}}{{price}}. I want {{goal}}.",
    {
      smokeType: smokeLabel,
      dailyAmount: dailyLabel,
      currency: packPriceCurrency || "$",
      price: packPrice || "5",
      goal: goalText,
    }
  );

  // parallax
  const scrollY = useRef(new Animated.Value(0)).current;

  // Theme (SideModal)
  const [showSideModal, setShowSideModal] = useState(false);
  const [side, setSide] = useState<Side>(isDark ? "dark" : "bright");
  useEffect(() => {
    setSide(isDark ? "dark" : "bright");
  }, [isDark]);

  const handlePickSide = (s: Side) => {
    setSide(s);
    setTheme(s === "dark" ? "dark" : "light");
    setShowSideModal(false);
  };

  // Support slide
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleBuyPack = (pack: CoinPack) => {
    setUserCoins(userCoins + pack.coins);
    // hook: analytics / server call could go here
  };

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
              ? { backgroundColor: hovered ? "#475569" : "#334155" }
              : { backgroundColor: hovered ? "#e0e7ff" : "#f8fafc" },
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
          {t("profile.title", "Profile")}
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
        {/* Buddy card */}
        <View
          className={`mx-4 rounded-3xl ${
            isDark ? "bg-slate-700" : "bg-indigo-50"
          }`}
          style={{ height: 231 }}
        >
          <View className="rounded-3xl overflow-hidden" style={{ height: 143 }}>
            <ParallaxBackground scrollY={scrollY} height={143} anchor="middle">
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
                {/* Lottie buddy */}
                <LottieView
                  source={buddySource}
                  autoPlay
                  loop
                  style={{
                    width: "100%",
                    height: 143,
                    zIndex: 21,
                    transform: [{ scale: 1.3 }],
                  }}
                />
              </View>

              {/* Edit buddy -> BuddySelection */}
              <Pressable
                onPress={onNavigateToBuddy}
                className={`w-10 h-10 rounded-full z-[41] justify-center items-center absolute right-3 top-3 p-1 ${
                  isDark ? "bg-slate-500" : "bg-indigo-100"
                }`}
                hitSlop={10}
                style={({ hovered }) => [
                  isDark
                    ? { backgroundColor: hovered ? "#475569" : "#334155" }
                    : { backgroundColor: hovered ? "#e0e7ff" : "#f8fafc" },
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
              {buddyName || t("profile.buddy.fallbackName", "Buddy")}
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

        {/* Savings + Habits card */}
        <View
          className={`mx-4 mt-4 rounded-3xl ${
            isDark ? "bg-slate-700" : "bg-indigo-50"
          } p-5`}
        >
          <View className="flex-row items-end justify-center">
            <Text
              className={`${isDark ? "text-white" : "text-indigo-950"}`}
              style={{ fontWeight: "800", fontSize: 40, lineHeight: 44 }}
            >
              {savingsText}
            </Text>
            <Text
              className={`ml-1 mb-1 ${
                isDark ? "text-slate-300" : "text-indigo-950"
              }`}
              style={{ fontWeight: "700", fontSize: 20 }}
            >
              /year
            </Text>
          </View>
          <Text
            className={`${
              isDark ? "text-slate-300" : "text-slate-500"
            } mt-1 text-center`}
            style={{ fontSize: 16, fontWeight: "600" }}
          >
            {t("profile.habits.estimatedSavings", "Estimated daily savings")}
          </Text>

          <View
            className={`${isDark ? "bg-slate-600" : "bg-indigo-100"} my-4`}
            style={{ height: 1 }}
          />

          <View className="flex-row items-center justify-between">
            <Text
              className={`${isDark ? "text-white" : "text-indigo-950"}`}
              style={{ fontWeight: "700", fontSize: 16 }}
            >
              {t("profile.habits.title", "My smoking habits")}
            </Text>

            {/* Edit habits -> open Setup (fromProfile) */}
            <Pressable
              onPress={onNavigateToSetup}
              className={`w-10 h-10 rounded-full justify-center items-center ${
                isDark ? "bg-slate-700" : "bg-slate-50"
              }`}
              hitSlop={10}
              style={isDark ? { elevation: 2 } : undefined}
            >
              <EditIcon width={18} height={18} color={iconColor} />
            </Pressable>
          </View>

          <Text
            className={`${isDark ? "text-slate-200" : "text-indigo-950"} mt-2`}
            style={{ fontSize: 14, lineHeight: 20, fontWeight: "500" }}
          >
            {habitsLine}
          </Text>
        </View>

        {/* divider */}
        <View
          className="self-center my-4"
          style={{
            width: 72,
            height: 2,
            backgroundColor: isDark ? "#475569" : "#E2E8F0",
            borderRadius: 2,
          }}
        />

        {/* Settings block 1 */}
        <View className="mx-4 gap-3">
          {/* Notifications */}
          <Pressable
            className={`w-full h-14 rounded-full px-4 flex-row items-center justify-between ${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            }`}
            onPress={() => {}}
          >
            <View className="flex-row items-center">
              <Icons.Notification
                width={20}
                height={20}
                color={systemIconColor}
              />
              <Text
                className={`ml-3 ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontWeight: "600" }}
              >
                {t("profile.sections.notification", "Notification")}
              </Text>
            </View>
            <Ionicons name="checkmark" size={18} color={systemIconColor} />
          </Pressable>

          {/* Theme */}
          <Pressable
            className={`w-full h-14 rounded-full px-4 flex-row items-center justify-between ${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            }`}
            onPress={() => setShowSideModal(true)}
          >
            <View className="flex-row items-center">
              <Icons.Theme width={20} height={20} color={systemIconColor} />
              <Text
                className={`ml-3 ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontWeight: "600" }}
              >
                {t("profile.sections.theme", "Theme")}
              </Text>
            </View>
            <Ionicons name="checkmark" size={18} color={systemIconColor} />
          </Pressable>

          {/* Language */}
          <Pressable
            className={`w-full h-14 rounded-full px-4 flex-row items-center justify-between ${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            }`}
            onPress={() => setShowLanguageModal(true)}
          >
            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full items-center justify-center overflow-hidden mr-2">
                {currentLanguage.flag && (
                  <currentLanguage.flag width={24} height={24} />
                )}
              </View>
              <Text
                className={`${isDark ? "text-slate-100" : "text-indigo-950"}`}
                style={{ fontWeight: "600" }}
              >
                {currentLanguage.name}
              </Text>
            </View>
            <Ionicons name="checkmark" size={18} color={systemIconColor} />
          </Pressable>
        </View>

        {/* divider */}
        <View
          className="self-center my-4"
          style={{
            width: 72,
            height: 2,
            backgroundColor: isDark ? "#475569" : "#E2E8F0",
            borderRadius: 2,
          }}
        />

        {/* Settings block 2 */}
        <View className="mx-4 gap-3">
          {/* Feedback -> open SupportSlide */}
          {/* <Pressable
            className={`w-full h-14 rounded-full px-4 flex-row items-center justify-between ${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            }`}
            onPress={() => setShowReview(true)}
          >
            <View className="flex-row items-center">
              <Icons.Feedback width={20} height={20} color={systemIconColor} />
              <Text
                className={`ml-3 ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontWeight: "600" }}
              >
                {t("profile.sections.feedback", "Feedback")}
              </Text>
            </View>
            <Ionicons name="checkmark" size={18} color={systemIconColor} />
          </Pressable> */}

          {/* Support -> open SupportSlide */}
          <Pressable
            className={`w-full h-14 rounded-full px-4 flex-row items-center justify-between ${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            }`}
            onPress={() => setShowSupportModal(true)}
          >
            <View className="flex-row items-center">
              <Icons.Support width={20} height={20} color={systemIconColor} />
              <Text
                className={`ml-3 ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontWeight: "600" }}
              >
                {t("profile.sections.support", "Support")}
              </Text>
            </View>
            <Ionicons name="checkmark" size={18} color={systemIconColor} />
          </Pressable>
        </View>
        {!hasLeftReview && (
          <>
            <View
              className="self-center my-4"
              style={{
                width: 72,
                height: 2,
                backgroundColor: isDark ? "#475569" : "#E2E8F0",
                borderRadius: 2,
              }}
            />
            {/* Promo cards: Refer + Review */}
            <PromoCards
              onShared={() => {
                // optional analytics/coins awarding hook
              }}
              onOpenReview={() => setShowReview(true)}
            />
          </>
        ) }

        {/* <View
          className="self-center my-4"
          style={{
            width: 72,
            height: 2,
            backgroundColor: isDark ? "#475569" : "#E2E8F0",
            borderRadius: 2,
          }}
        /> */}

        {/* Coin packs */}
        {/* <View className="mx-4">
          <Text
            className={`text-center font-extrabold ${
              isDark ? "text-white" : "text-indigo-950"
            }`}
            style={{ fontSize: 24 }}
          >
            {t("coinModal.title", "Get More Coins")}
          </Text>
          <Text
            className={`mt-1 text-center ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}
            style={{ fontSize: 14, fontWeight: "600" }}
          >
            {t("coinModal.subtitle", "Choose your pack and keep going!")}
          </Text>

          <View className="mt-4">
            {COIN_PACKS.map((pack) => (
              <CoinPackCard key={pack.id} pack={pack} onPress={handleBuyPack} />
            ))}
          </View>
        </View> */}
      </Animated.ScrollView>

      {/* Language slide */}
      <LanguageSlide
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />

      <ReviewModal
        visible={showReview}
        onClose={() => setShowReview(false)}
        onSubmit={(stars) => {
          handleLeaveReview(stars)
          setShowReview(false)
        }}
      />

      {/* Theme picker */}
      <SideModal
        visible={showSideModal}
        isDark={isDark}
        side={side}
        onSelect={handlePickSide}
        onClose={() => setShowSideModal(false)}
      />

      {/* Support slide */}
      <SupportSlide
        visible={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </View>
  );
};

export default Profile;
function setUserCoins(arg0: any) {
  throw new Error("Function not implemented.");
}
