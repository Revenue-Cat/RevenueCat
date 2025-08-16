// src/screens/BuddySelection.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useApp } from "../contexts/AppContext";
import BuddyCarousel, { Buddy } from "../components/BuddyCarousel";
import type { SexKey } from "../assets/buddies";

import GenderLight from "../assets/icons/gander.svg";
import GenderDark from "../assets/icons/gander-d.svg";
import CharacterLight from "../assets/icons/character.svg";
import CharacterDark from "../assets/icons/character-d.svg";
import SunLight from "../assets/icons/sun.svg";
import SunDark from "../assets/icons/sun-d.svg";
import MoonLight from "../assets/icons/moon.svg";
import MoonDark from "../assets/icons/moon-d.svg";
import ManLight from "../assets/icons/man.svg";
import ManDark from "../assets/icons/man-d.svg";
import WomanLight from "../assets/icons/woman.svg";
import WomanDark from "../assets/icons/woman-d.svg";
import IncognitoLight from "../assets/icons/incognito.svg";
import IncognitoDark from "../assets/icons/incognito-d.svg";

type Gender = "man" | "lady" | "any";
type Side = "bright" | "dark";

interface Props {
  onNext: () => void;
}

const BuddySelection: React.FC<Props> = ({ onNext }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  const {
    gender: savedGender,
    setGender: setGenderCtx,
    selectedBuddyId,
    setSelectedBuddyId,
    buddyName: savedBuddyName,
    setBuddyName: setBuddyNameCtx,
  } = useApp();

  const Icons = {
    Gender: isDark ? GenderDark : GenderLight,
    Character: isDark ? CharacterDark : CharacterLight,
    Sun: isDark ? SunDark : SunLight,
    Moon: isDark ? MoonDark : MoonLight,
    Man: isDark ? ManDark : ManLight,
    Woman: isDark ? WomanDark : WomanLight,
    Incognito: isDark ? IncognitoDark : IncognitoLight,
  };

  // Gender / sex key for images
  const [gender, setGender] = useState<Gender>(savedGender);
  const sexKey: SexKey = gender === "lady" ? "w" : "m";

  // Bright/Dark side (controls theme)
  const [side, setSide] = useState<Side>(isDark ? "dark" : "bright");
  useEffect(() => {
    setSide(isDark ? "dark" : "bright");
  }, [isDark]);

  // Buddies (i18n + fallbacks)
  const buddies: Buddy[] = useMemo(
    () => [
      {
        id: "alpaca",
        name: t("buddySelection.buddies.alpaca?.name", "Alpaca Calmington"),
        description: t(
          "buddySelection.buddies.alpaca?.description",
          "Soft-spoken strategist who keeps you cozy while cravings pass."
        ),
      },
      {
        id: "dog",
        name: t("buddySelection.buddies.dog?.name", "Captain Pup"),
        description: t(
          "buddySelection.buddies.dog?.description",
          "Loyal motivator who fetches wins and guards your streaks."
        ),
      },
      {
        id: "fox",
        name: t("buddySelection.buddies.fox?.name", "Foxy Focus"),
        description: t(
          "buddySelection.buddies.fox?.description",
          "Quick-witted planner who helps you outsmart triggers."
        ),
      },
      {
        id: "koala",
        name: t("buddySelection.buddies.koala?.name", "Monsieur Sniff"),
        description: t(
          "buddySelection.buddies.koala?.description",
          "Sniffs out trouble and keeps your breath fresher than a Paris morning."
        ),
      },
      {
        id: "zebra",
        name: t("buddySelection.buddies.zebra?.name", "Zebra Zen"),
        description: t(
          "buddySelection.buddies.zebra?.description",
          "Stripe-powered calm to pace your progress with style."
        ),
      },
    ],
    [t]
  );

  // Initial index = saved id if any
  const savedIndex = Math.max(
    0,
    buddies.findIndex((b) => b.id === selectedBuddyId)
  );
  const initialIndex = savedIndex === -1 ? 0 : savedIndex;

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  // Display name:
  // - On first render, prefer saved custom name if it exists, else buddy default.
  // - On carousel change, ALWAYS switch to the new buddy's default name (and persist to context).
  const [buddyName, setBuddyNameLocal] = useState<string>(
    savedBuddyName || buddies[initialIndex]?.name || buddies[0].name
  );

  // If language changes (buddies array re-computed), keep name synced to the
  // current buddy's *default* name as per request.
  useEffect(() => {
    const nextDefault = buddies[activeIndex]?.name ?? buddies[0].name;
    setBuddyNameLocal(nextDefault);
    setBuddyNameCtx(nextDefault);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buddies, activeIndex]);

  // UI state
  const [showNameModal, setShowNameModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showSideModal, setShowSideModal] = useState(false);
  const [nameDraft, setNameDraft] = useState(buddyName);

  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";

  const confirmName = () => {
    const finalName = nameDraft.trim() || buddies[activeIndex].name;
    setBuddyNameLocal(finalName);
    setBuddyNameCtx(finalName);
    setShowNameModal(false);
  };

  const cancelName = () => {
    setNameDraft(buddyName);
    setShowNameModal(false);
  };

  const pickSide = (s: Side) => {
    setSide(s);
    setTheme(s === "dark" ? "dark" : "light");
    setShowSideModal(false);
  };

  return (
    <View
      className={`flex-1 ${isDark ? "bg-dark-background" : "bg-light-background"}`}
    >
      {/* Header */}
      <View className="items-center pt-16 px-6 mb-2">
        <Text
          className={`text-2xl font-bold mb-3 text-center ${isDark ? "text-slate-100" : "text-indigo-950"}`}
        >
          {t("buddySelection.title", "Pick your quit buddy")}
        </Text>
        <Text
          className={`text-center font-medium leading-6 px-5 ${isDark ? "text-slate-300" : "text-slate-500"}`}
        >
          {t(
            "buddySelection.subtitle",
            "Choose your support animal to guide you on your journey!"
          )}
        </Text>
      </View>

      {/* Carousel */}
      <View className="mt-2">
        <BuddyCarousel
          data={buddies}
          sex={gender === "lady" ? "w" : "m"}
          isDark={isDark}
          onChange={(i) => {
            setActiveIndex(i);
            setSelectedBuddyId(buddies[i].id);
            const defaultName = buddies[i].name;
            setBuddyNameLocal(defaultName); // <-- ALWAYS switch to default on change
            setBuddyNameCtx(defaultName); // <-- persist to context too
            setNameDraft(defaultName); // keep modal draft in sync
          }}
        />
      </View>

      {/* Name & Description */}
      <Text
        className={`${isDark ? "text-slate-100" : "text-indigo-950"} text-center mt-8`}
        style={{
          fontFamily: "Inter",
          fontWeight: "700",
          fontSize: 16,
          lineHeight: 24,
        }}
      >
        {buddyName}
      </Text>
      <Text
        className="text-slate-500 text-center mt-[10px] px-8"
        style={{
          fontFamily: "Inter",
          fontWeight: "500",
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        {buddies[activeIndex]?.description}
      </Text>

      {/* Dots (dark: active slate-300, inactive slate-700; light: active indigo-950, inactive slate-200) */}
      <View className="mt-4 flex-row justify-center">
        {buddies.map((_, i) => {
          const active = i === activeIndex;
          const bg = isDark
            ? active
              ? "#CBD5E1"
              : "#334155"
            : active
              ? "#1e1b4b"
              : "#E5E7EB";
          return (
            <View
              key={i}
              className="w-[6px] h-[6px] rounded-full mx-[4px]"
              style={{ backgroundColor: bg }}
            />
          );
        })}
      </View>

      {/* Selection rows */}
      <View className="mt-6 px-6 gap-3">
        {/* Buddy name row */}
        <Pressable
          onPress={() => {
            setNameDraft(buddyName);
            setShowNameModal(true);
          }}
          className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
            isDark ? "bg-slate-700" : "bg-indigo-50"
          }`}
        >
          <View className="flex-row items-center">
            <Icons.Character width={20} height={20} color={systemIconColor} />
            <Text
              className={`ml-3 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
              style={{ fontWeight: "600" }}
            >
              {buddyName}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={systemIconColor}
          />
        </Pressable>

        {/* Gender row */}
        <Pressable
          onPress={() => setShowGenderModal(true)}
          className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
            isDark ? "bg-slate-700" : "bg-indigo-50"
          }`}
        >
          <View className="flex-row items-center">
            <Icons.Gender width={20} height={20} color={systemIconColor} />
            <Text
              className={`ml-3 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
              style={{ fontWeight: "600" }}
            >
              {gender === "man"
                ? "Man"
                : gender === "lady"
                  ? "Woman"
                  : "Isn't important"}
            </Text>
          </View>
          <Ionicons name="checkmark" size={18} color={systemIconColor} />
        </Pressable>

        {/* Side row */}
        <Pressable
          onPress={() => setShowSideModal(true)}
          className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
            isDark ? "bg-slate-700" : "bg-indigo-50"
          }`}
        >
          <View className="flex-row items-center">
            {side === "bright" ? (
              <Icons.Sun width={20} height={20} color={systemIconColor} />
            ) : (
              <Icons.Moon width={20} height={20} color={systemIconColor} />
            )}
            <Text
              className={`ml-3 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
              style={{ fontWeight: "600" }}
            >
              {side === "bright" ? "Bright side" : "Dark side"}
            </Text>
          </View>
          <Ionicons name="checkmark" size={18} color={systemIconColor} />
        </Pressable>
      </View>

      {/* CTA */}
      <View className="px-6 pb-8 mt-6">
        <Pressable
          className="rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600"
          onPress={onNext}
        >
          <Text className="font-semibold text-xl mr-2 text-white">
            {t("buddySelection.next", "Let’s Go, Buddy!")}
          </Text>
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* NAME MODAL */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNameModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View
              className={`${isDark ? "bg-dark-background" : "bg-light-background"} rounded-t-3xl`}
            >
              <View className="px-5 pt-6 pb-8">
                <Text
                  className={`text-lg font-bold text-center mb-4 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
                >
                  Buddy name
                </Text>

                <View
                  className={`rounded-2xl px-3 py-2 ${
                    isDark
                      ? "bg-slate-700 border border-slate-600"
                      : "bg-indigo-50 border border-indigo-200"
                  }`}
                >
                  <TextInput
                    value={nameDraft}
                    onChangeText={setNameDraft}
                    placeholder="Type a name"
                    placeholderTextColor="#94A3B8"
                    className={`h-12 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
                    style={{ fontSize: 16 }}
                    returnKeyType="done"
                    onSubmitEditing={confirmName}
                  />
                </View>

                <View className="flex-row justify-center gap-4 mt-4">
                  <Pressable
                    onPress={cancelName}
                    className={`${isDark ? "bg-dark-surface" : "bg-gray-100"} w-12 h-12 rounded-full items-center justify-center`}
                  >
                    <Ionicons name="close" size={20} color={systemIconColor} />
                  </Pressable>
                  <Pressable
                    className="bg-indigo-600 w-12 h-12 rounded-full items-center justify-center"
                    onPress={confirmName}
                  >
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </Pressable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* GENDER MODAL */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className={`${isDark ? "bg-dark-background" : "bg-light-background"} rounded-t-3xl`}
          >
            <View className="px-5 pt-6 pb-8">
              <Text
                className={`text-lg font-bold text-center mb-4 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
              >
                Gender
              </Text>

              {(
                [
                  { key: "man", label: "Man", Icon: Icons.Man },
                  { key: "lady", label: "Woman", Icon: Icons.Woman },
                  {
                    key: "any",
                    label: "Isn't important",
                    Icon: Icons.Incognito,
                  },
                ] as const
              ).map(({ key, label, Icon }) => {
                const selected = gender === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      setGender(key);
                      setGenderCtx(key);
                      setShowGenderModal(false);
                    }}
                    className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between mb-3 ${
                      selected
                        ? isDark
                          ? "bg-slate-600"
                          : "bg-indigo-100"
                        : isDark
                          ? "bg-slate-700"
                          : "bg-indigo-50"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Icon width={20} height={20} color={systemIconColor} />
                      <Text
                        className={`ml-3 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
                        style={{ fontWeight: "600" }}
                      >
                        {label}
                      </Text>
                    </View>
                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={systemIconColor}
                      />
                    )}
                  </Pressable>
                );
              })}

              <Pressable
                onPress={() => setShowGenderModal(false)}
                className={`${isDark ? "bg-dark-surface" : "bg-gray-100"} w-12 h-12 rounded-full items-center justify-center self-center mt-2`}
              >
                <Ionicons name="close" size={20} color={systemIconColor} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* SIDE MODAL */}
      <Modal
        visible={showSideModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSideModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className={`${isDark ? "bg-dark-background" : "bg-light-background"} rounded-t-3xl`}
          >
            <View className="px-5 pt-6 pb-8">
              <Text
                className={`text-lg font-bold text-center mb-4 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
              >
                Bright or dark side?
              </Text>

              {(
                [
                  { key: "bright", label: "Bright side", Icon: Icons.Sun },
                  { key: "dark", label: "Dark side", Icon: Icons.Moon },
                ] as const
              ).map(({ key, label, Icon }) => {
                const selected = side === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => pickSide(key)}
                    className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between mb-3 ${
                      selected
                        ? isDark
                          ? "bg-slate-600"
                          : "bg-indigo-100"
                        : isDark
                          ? "bg-slate-700"
                          : "bg-indigo-50"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Icon width={20} height={20} color={systemIconColor} />
                      <Text
                        className={`ml-3 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
                        style={{ fontWeight: "600" }}
                      >
                        {label}
                      </Text>
                    </View>
                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={systemIconColor}
                      />
                    )}
                  </Pressable>
                );
              })}

              <Text
                className={`text-center mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                style={{ fontSize: 12 }}
              >
                This selection will set your app’s theme to light or dark.
              </Text>

              <Pressable
                onPress={() => setShowSideModal(false)}
                className={`${isDark ? "bg-dark-surface" : "bg-gray-100"} w-12 h-12 rounded-full items-center justify-center self-center mt-3`}
              >
                <Ionicons name="close" size={20} color={systemIconColor} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BuddySelection;
