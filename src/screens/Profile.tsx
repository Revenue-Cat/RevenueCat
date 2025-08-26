import React, { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";

import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";
import ParallaxBackground from "../components/ParallaxBackground";
import LanguageSlide from "../components/LanguageSlide";
import SlideModal from "../components/SlideModal";
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
import ArrowRightLight from "../assets/icons/arrow-right.svg";
import ArrowRightDark from "../assets/icons/arrow-right-d.svg";
import FlagEn from "../assets/icons/flag-en.svg";
import FlagEs from "../assets/icons/flag-es.svg";
import FlagUk from "../assets/icons/flag-uk.svg";

interface ProfileProps {
  onBack: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToShop: () => void;
  onNavigateToSetup?: () => void; // optional hook if you later open Setup from here
}

type HabitField = "smokeType" | "dailyAmount" | "packPrice" | "goal";
type Side = "bright" | "dark";

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  // theme
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // icons + colors per theme
  const EditIcon = isDark ? EditDark : EditLight;
  const PrevIcon = isDark ? PrevDark : PrevLight;
  const Right = isDark ? ArrowRightDark : ArrowRightLight;
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
    openShopWithTab,

    smokeType,
    dailyAmount,
    packPrice,
    packPriceCurrency,
    goal,

    setSmokeType,
    setDailyAmount,
    setPackPrice,
    setGoal,
  } = useApp();

  // buddy sprite
  const sexKey: SexKey = gender === "lady" ? "w" : "m";
  const buddySource = useMemo(
    () => buddyAssets[selectedBuddyId as BuddyKey][sexKey],
    [selectedBuddyId, sexKey]
  );

  // savings + habits
  const goalText =
    goal === "quit-completely"
      ? "quit completely"
      : goal === "reduce-gradually"
      ? "reduce gradually"
      : goal === "save-money"
      ? "save money"
      : goal === "improve-health"
      ? "improve health"
      : goal === "gain-control"
      ? "gain control"
      : "quit completely";

  const habitsLine = `I smoke ${smokeType || "cigarettes"}, usually ${
    dailyAmount || "5–10"
  } a day. A pack costs me around ${packPriceCurrency || "$"}${
    packPrice || "5"
  }. I want to ${goalText}.`;

  const avgMap: Record<string, number> = {
    "1-5": 3,
    "5-10": 7.5,
    "11-15": 13,
    "16-20": 18,
    "21-30": 25,
    "31-40": 35,
  };
  const avgCigs = avgMap[dailyAmount || "5-10"] ?? 7.5;
  const price = Number(packPrice || 5) || 5;
  const perDay = (avgCigs / 20) * price;
  const perYear = Math.round(perDay * 365);
  const savingsText = `${packPriceCurrency || "$"}${perYear}`;

  const genderLabel =
    gender === "lady" ? "Woman" : gender === "man" ? "Man" : "Non-binary";

  // parallax
  const scrollY = useRef(new Animated.Value(0)).current;

  // habits editing (kept as-is)
  const [showHabitsModal, setShowHabitsModal] = useState(false);
  const [editingField, setEditingField] = useState<HabitField | null>(null);

  const fieldDefs = useMemo(
    () => [
      {
        id: "smokeType" as const,
        label: "What do you usually smoke?",
        value: smokeType || "cigarettes",
        options: [
          { value: "cigarettes", label: "Cigarettes" },
          { value: "tobacco-heater", label: "Tobacco heater" },
          { value: "roll-your-own", label: "Roll-your-own" },
        ],
        onSelect: (v: string) => setSmokeType(v),
      },
      {
        id: "dailyAmount" as const,
        label: "How much do you use daily?",
        value: dailyAmount || "5-10",
        options: [
          { value: "1-5", label: "1-5 cigarettes per day" },
          { value: "5-10", label: "5-10 cigarettes per day" },
          { value: "11-15", label: "11-15 cigarettes per day" },
          { value: "16-20", label: "16-20 cigarettes per day (1 pack)" },
          { value: "21-30", label: "21-30 cigarettes per day" },
          { value: "31-40", label: "31-40 cigarettes per day (2 packs)" },
        ],
        onSelect: (v: string) => setDailyAmount(v),
      },
      {
        id: "packPrice" as const,
        label: "How much do you pay for one unit?",
        value: packPrice || "5",
        options: [
          { value: "3", label: "$3" },
          { value: "4", label: "$4" },
          { value: "5", label: "$5" },
          { value: "6", label: "$6" },
          { value: "7", label: "$7" },
        ],
        onSelect: (v: string) => setPackPrice(v),
      },
      {
        id: "goal" as const,
        label: "What's your main goal?",
        value: goal || "quit-completely",
        options: [
          { value: "quit-completely", label: "Quit completely" },
          { value: "reduce-gradually", label: "Reduce gradually" },
          { value: "save-money", label: "Save money" },
          { value: "improve-health", label: "Improve health" },
          { value: "gain-control", label: "Gain control" },
          { value: "doesnt-matter", label: "Doesn't matter" },
        ],
        onSelect: (v: string) => setGoal(v),
      },
    ],
    [
      smokeType,
      dailyAmount,
      packPrice,
      goal,
      setSmokeType,
      setDailyAmount,
      setPackPrice,
      setGoal,
    ]
  );

  const fieldById = (id: HabitField | null) =>
    fieldDefs.find((f) => f.id === id)!;

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

              <Pressable
                onPress={() => openShopWithTab("characters")}
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
            Estimated daily savings
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
              My smoking habits
            </Text>

            <Pressable
              onPress={() => setShowHabitsModal(true)}
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
            className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
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
                Notification
              </Text>
            </View>
            <Right width={18} height={12} color={systemIconColor} />
          </Pressable>

          {/* Theme */}
          <Pressable
            className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
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
                Theme
              </Text>
            </View>
            <Right width={18} height={12} color={systemIconColor} />
          </Pressable>

          {/* Language */}
          <Pressable
            className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
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
            <Right width={18} height={12} color={systemIconColor} />
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
          {/* Feedback */}
          <Pressable
            className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            }`}
            onPress={() => {}}
          >
            <View className="flex-row items-center">
              <Icons.Feedback width={20} height={20} color={systemIconColor} />
              <Text
                className={`ml-3 ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontWeight: "600" }}
              >
                Feedback
              </Text>
            </View>
            <Right width={18} height={12} color={systemIconColor} />
          </Pressable>

          {/* Support -> opens SupportSlide */}
          <Pressable
            className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
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
                Support
              </Text>
            </View>
            <Right width={18} height={12} color={systemIconColor} />
          </Pressable>
        </View>
      </Animated.ScrollView>

      {/* Language slide */}
      <LanguageSlide
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
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

      {/* Habits launcher */}
      <SlideModal
        visible={showHabitsModal}
        onClose={() => setShowHabitsModal(false)}
        title="Edit smoking habits"
      >
        <View className="gap-3">
          {fieldDefs.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setEditingField(f.id)}
              className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
                isDark ? "bg-slate-700" : "bg-indigo-50"
              }`}
            >
              <Text
                className={`${isDark ? "text-slate-100" : "text-indigo-950"}`}
                style={{ fontWeight: "600" }}
                numberOfLines={1}
              >
                {f.label}
              </Text>
              <Right width={18} height={12} color={systemIconColor} />
            </Pressable>
          ))}
        </View>
      </SlideModal>

      {/* Single-field options modal */}
      {editingField && (
        <SlideModal
          visible
          onClose={() => setEditingField(null)}
          title={fieldById(editingField).label}
        >
          <View className="gap-4">
            {fieldById(editingField).options.map((opt) => {
              const selected =
                String(fieldById(editingField).value) === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  className={`w-11/12 h-16 rounded-3xl flex-row justify-between items-center px-5 self-center ${
                    selected
                      ? isDark
                        ? "bg-slate-600"
                        : "bg-indigo-100"
                      : isDark
                      ? "bg-slate-700"
                      : "bg-indigo-50"
                  }`}
                  onPress={() => {
                    fieldById(editingField).onSelect(opt.value);
                    setEditingField(null);
                  }}
                >
                  <Text
                    className={`text-base ${
                      selected ? "font-bold" : "font-medium"
                    } ${isDark ? "text-slate-100" : "text-indigo-950"}`}
                  >
                    {opt.label}
                  </Text>
                  {/* keep checkmark here */}
                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={isDark ? "#CBD5E1" : "#1e1b4b"}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </SlideModal>
      )}
    </View>
  );
};

export default Profile;
