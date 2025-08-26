// src/screens/Setup.tsx
import React, { useState, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useApp } from "../contexts/AppContext";

import PackPricePickerModal from "../components/PackPricePickerModal";
import SmokeTypeModal from "../components/SmokeTypeModal";
import DailyAmountModal from "../components/DailyAmountModal";
import GoalModal from "../components/GoalModal";

// Field icons
import SmokeIcon from "../assets/icons/smoke.svg";
import TargetIcon from "../assets/icons/target.svg";
import SpendIcon from "../assets/icons/spend.svg";
import CalendarIcon from "../assets/icons/calendar.svg";
import VapeIcon from "../assets/icons/vape.svg";
import RollIcon from "../assets/icons/roll.svg";
import HeatedIcon from "../assets/icons/heated.svg";
import NoMeterIcon from "../assets/icons/no-mater.svg";
import BrainIcon from "../assets/icons/brain.svg";
import HearthIcon from "../assets/icons/heart.svg";
import SaveMoneyIcon from "../assets/icons/save-money.svg";
import ChartDownIcon from "../assets/icons/chart_down.svg";
import QuitIcon from "../assets/icons/quit.svg";

// Nav icons (match Profile header)
import PrevLight from "../assets/icons/prev.svg";
import PrevDark from "../assets/icons/prev-d.svg";

interface SetupData {
  smokeType: string;
  dailyAmount: string;
  packPrice: string;
  packPriceCurrency: string;
  goal: string;
  [key: string]: string;
}

interface SetupProps {
  onNext: () => void;
  onBack?: () => void;
  fromProfile?: boolean; // when opened from Profile, show habits header + hide Next
}

const Setup: React.FC<SetupProps> = ({ onNext, onBack, fromProfile }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const PrevIcon = isDark ? PrevDark : PrevLight;

  const {
    smokeType,
    dailyAmount,
    packPrice,
    packPriceCurrency,
    goal,
    setSmokeType,
    setDailyAmount,
    setPackPrice,
    setPackPriceCurrency,
    setGoal,
  } = useApp();

  const setupData: SetupData = {
    smokeType,
    dailyAmount,
    packPrice,
    packPriceCurrency,
    goal,
  };

  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [pickerValue, setPickerValue] = useState(3);
  const [pickerCurrency, setPickerCurrency] = useState("$");

  const allFieldsCompleted = Object.values(setupData).every((v) => v !== "");

  const handleFieldClick = (field: string) => {
    if (field === "packPrice") {
      if (packPrice) setPickerValue(parseInt(packPrice));
      if (packPriceCurrency) setPickerCurrency(packPriceCurrency);
    }
    setCurrentStep(field);
  };

  const handleSelection = (field: keyof SetupData, value: string) => {
    switch (field) {
      case "smokeType":
        setSmokeType(value);
        break;
      case "dailyAmount":
        setDailyAmount(value);
        break;
      case "goal":
        setGoal(value);
        break;
    }
    setCurrentStep(null);
  };

  const handlePickerConfirm = () => {
    setPackPrice(pickerValue.toString());
    setPackPriceCurrency(pickerCurrency);
    setCurrentStep(null);
  };

  const iconColor = setupData[currentStep as keyof SetupData]
    ? "#312E81"
    : isDark
    ? "#CBD5E1"
    : "#1E1B4B";

  // ---- Savings header (same math as Profile) ----
  const { savingsText } = useMemo(() => {
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
    return { savingsText: `${packPriceCurrency || "$"}${perYear}` };
  }, [dailyAmount, packPrice, packPriceCurrency]);

  const setupFields = [
    {
      id: "smokeType",
      label: t("setup.fields.smokeType.label"),
      modalTitle: t("setup.fields.smokeType.modalTitle"),
      icon: <SmokeIcon width={20} height={20} color={iconColor} />,
      value: setupData.smokeType,
      options: [
        {
          value: "cigarettes",
          label: t("setup.fields.smokeType.options.cigarettes"),
          icon: <SmokeIcon width={20} height={20} color={iconColor} />,
        },
        {
          value: "tobacco-heater",
          label: t("setup.fields.smokeType.options.tobacco-heater"),
          icon: <RollIcon width={20} height={20} color={iconColor} />,
        },
        {
          value: "roll-your-own",
          label: t("setup.fields.smokeType.options.roll-your-own"),
          icon: <HeatedIcon width={20} height={20} color={iconColor} />,
        },
        {
          value: "vaping",
          label: t("setup.fields.smokeType.options.vaping"),
          icon: <VapeIcon width={20} height={20} color={iconColor} />,
        },
      ],
    },
    {
      id: "dailyAmount",
      label: t("setup.fields.dailyAmount.label"),
      modalTitle: t("setup.fields.dailyAmount.modalTitle"),
      icon: <CalendarIcon width={20} height={20} color={iconColor} />,
      value: setupData.dailyAmount,
      options: [
        { value: "1-5", label: t("setup.fields.dailyAmount.options.1-5") },
        { value: "5-10", label: t("setup.fields.dailyAmount.options.5-10") },
        { value: "11-15", label: t("setup.fields.dailyAmount.options.11-15") },
        { value: "16-20", label: t("setup.fields.dailyAmount.options.16-20") },
        { value: "21-30", label: t("setup.fields.dailyAmount.options.21-30") },
        { value: "31-40", label: t("setup.fields.dailyAmount.options.31-40") },
      ],
    },
    {
      id: "packPrice",
      label: t("setup.fields.packPrice.label"),
      modalTitle: t("setup.fields.packPrice.modalTitle"),
      icon: <SpendIcon width={20} height={20} color={iconColor} />,
      value: setupData.packPrice,
      options: [
        { value: "3", label: t("setup.fields.packPrice.options.3") },
        { value: "4", label: t("setup.fields.packPrice.options.4") },
        { value: "5", label: t("setup.fields.packPrice.options.5") },
        { value: "6", label: t("setup.fields.packPrice.options.6") },
        { value: "7", label: t("setup.fields.packPrice.options.7") },
      ],
    },
    {
      id: "goal",
      label: t("setup.fields.goal.label"),
      modalTitle: t("setup.fields.goal.modalTitle"),
      icon: <TargetIcon width={20} height={20} color={iconColor} />,
      value: setupData.goal,
      options: [
        {
          value: "quit-completely",
          label: t("setup.fields.goal.options.quit-completely"),
          icon: <QuitIcon width={20} height={20} color={iconColor} />,
        },
        {
          value: "reduce-gradually",
          label: t("setup.fields.goal.options.reduce-gradually"),
          icon: <ChartDownIcon width={20} height={20} color={iconColor} />,
        },
        {
          value: "save-money",
          label: t("setup.fields.goal.options.save-money"),
          icon: <SaveMoneyIcon width={20} height={20} color={iconColor} />,
        },
        {
          value: "improve-health",
          label: t("setup.fields.goal.options.improve-health"),
          icon: <HearthIcon width={20} height={20} color={iconColor} />,
        },
        {
          value: "gain-control",
          label: t("setup.fields.goal.options.gain-control"),
          icon: <BrainIcon width={20} height={20} color={iconColor} />,
        },
        {
          value: "doesnt-matter",
          label: t("setup.fields.goal.options.doesnt-matter"),
          icon: <NoMeterIcon width={20} height={20} color={iconColor} />,
        },
      ],
    },
  ];

  return (
    <View
      className={`flex-1 ${
        isDark ? "bg-dark-background" : "bg-light-background"
      }`}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10 }}
      >
        {/* Back (only if provided) + Title (changes if fromProfile) */}
        {onBack && (
          <View className="flex-row items-center justify-between">
            <Pressable
              className={`w-10 h-10 rounded-full justify-center items-center p-1 ${
                isDark ? "bg-slate-700" : "bg-slate-50"
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
              <PrevIcon
                width={18}
                height={18}
                color={isDark ? "#FFFFFF" : "#1e1b4b"}
              />
            </Pressable>
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-slate-100" : "text-indigo-950"
              }`}
            >
              {fromProfile
                ? t("profile.habits.title", "My smoking habits")
                : t("setup.header.title")}
            </Text>
            <View style={{ width: 40, height: 40 }} />
          </View>
        )}

        {/* Top copy / savings */}
        {fromProfile ? (
          // When launched from Profile
          <View className="items-center mt-2 mb-6">
            <View className="flex-row items-baseline">
              <Text
                className={`font-bold ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontSize: 48, lineHeight: 52 }}
              >
                {savingsText}
              </Text>
              <Text
                className={`ml-1 font-bold ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontSize: 20 }}
              >
                /year
              </Text>
            </View>
            <Text
              className={`${isDark ? "text-slate-300" : "text-slate-500"} mt-1`}
              style={{ fontSize: 16, fontWeight: "600" }}
            >
              {t("profile.habits.estimatedSavings", "Estimated daily savings")}
            </Text>
          </View>
        ) : (
          // Onboarding version
          <>
            <View className="items-center mb-8">
              <Text
                className={`text-2xl font-bold mb-3 text-center ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
              >
                {t("setup.header.title")}
              </Text>
              <Text
                className={`text-sm text-center leading-6 px-5 ${
                  isDark ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {t("setup.header.description")}
              </Text>
            </View>

            <View className="rounded-2xl p-6 items-center mb-8">
              <View className="flex-row items-baseline mb-2">
                <Text
                  className={`text-5xl font-bold ${
                    isDark ? "text-slate-100" : "text-indigo-950"
                  }`}
                >
                  {savingsText}
                </Text>
                <Text
                  className={`text-xl font-bold ml-1 ${
                    isDark ? "text-slate-100" : "text-indigo-950"
                  }`}
                >
                  /year
                </Text>
              </View>
              <Text
                className={`text-base text-center ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
              >
                {t("setup.stats.description")}
              </Text>
            </View>
          </>
        )}

        {/* Setup Fields */}
        <View className="gap-4 mb-8">
          {setupFields.map((field) => (
            <Pressable
              key={field.id}
              className={`w-11/12 h-16 rounded-3xl flex-row justify-between items-center px-3 self-center ${
                setupData[field.id]
                  ? isDark
                    ? "bg-slate-600"
                    : "bg-indigo-100"
                  : isDark
                  ? "bg-slate-700"
                  : "bg-indigo-50"
              }`}
              onPress={() => handleFieldClick(field.id)}
            >
              <View className="flex-row items-center flex-1">
                {field.icon}
                <Text
                  className={`text-base text-md pl-2 font-medium flex-1 ${
                    isDark ? "text-slate-100" : "text-indigo-950"
                  }`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {setupData[field.id] ? (
                    <Text>
                      {field.id === "smokeType" &&
                        t("setup.fields.smokeType.selected", {
                          value:
                            field.options.find(
                              (opt) => opt.value === setupData[field.id]
                            )?.label || setupData[field.id],
                        })}
                      {field.id === "dailyAmount" &&
                        t("setup.fields.dailyAmount.selected", {
                          value:
                            field.options.find(
                              (opt) => opt.value === setupData[field.id]
                            )?.label || setupData[field.id],
                        })}
                      {field.id === "packPrice" &&
                        t("setup.fields.packPrice.selected", {
                          value: `${setupData.packPriceCurrency}${
                            setupData[field.id]
                          }`,
                        })}
                      {field.id === "goal" &&
                        t("setup.fields.goal.selected", {
                          value:
                            field.options.find(
                              (opt) => opt.value === setupData[field.id]
                            )?.label || setupData[field.id],
                        })}
                    </Text>
                  ) : (
                    field.label
                  )}
                </Text>
              </View>
              <Ionicons
                name={
                  setupData[field.id] ? "checkmark" : "chevron-forward-outline"
                }
                size={20}
                color={isDark ? "#CBD5E1" : "#64748b"}
              />
            </Pressable>
          ))}
        </View>

        {/* Privacy Text */}
        <View className="px-6 mb-4">
          <Text className="text-xs text-slate-500 text-center">
            {t(
              "setup.privacyText",
              "Don't worry, your data is secure. We keep it private and won't pass it on."
            )}
          </Text>
        </View>
      </ScrollView>

      {/* CTA only when not launched from Profile */}
      {!fromProfile && (
        <View className="px-6 pb-8 items-center">
          <Pressable
            className={`rounded-2xl px-6 py-4 items-center justify-center flex-row ${
              allFieldsCompleted ? "bg-indigo-600" : "bg-indigo-600 opacity-50"
            }`}
            onPress={onNext}
            disabled={!allFieldsCompleted}
          >
            <Text className="font-semibold text-xl mr-2 text-white">
              {t("setup.nextButton.text")}
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
          </Pressable>
        </View>
      )}

      {/* Modals */}
      <SmokeTypeModal
        visible={currentStep === "smokeType"}
        onClose={() => setCurrentStep(null)}
        selectedValue={setupData.smokeType}
        onSelect={(value) => handleSelection("smokeType", value)}
      />
      <DailyAmountModal
        visible={currentStep === "dailyAmount"}
        onClose={() => setCurrentStep(null)}
        selectedValue={setupData.dailyAmount}
        onSelect={(value) => handleSelection("dailyAmount", value)}
      />
      <GoalModal
        visible={currentStep === "goal"}
        onClose={() => setCurrentStep(null)}
        selectedValue={setupData.goal}
        onSelect={(value) => handleSelection("goal", value)}
      />
      <PackPricePickerModal
        visible={currentStep === "packPrice"}
        onClose={() => setCurrentStep(null)}
        title={t("setup.fields.packPrice.modalTitle")}
        pickerValue={pickerValue}
        pickerCurrency={pickerCurrency}
        onValueChange={setPickerValue}
        onCurrencyChange={setPickerCurrency}
        onConfirm={handlePickerConfirm}
      />
    </View>
  );
};

export default Setup;
