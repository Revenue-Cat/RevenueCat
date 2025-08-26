import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useApp } from "../contexts/AppContext";
import BuddyCarousel, { Buddy } from "../components/BuddyCarousel";
import type { SexKey } from "../assets/buddies";

// Modals
import BuddyNameModal from "../components/BuddyNameModal";
import GenderModal from "../components/GenderModal";
import SideModal from "../components/SideModal";

// icon sets (light/dark)
import GenderLight from "../assets/icons/gander.svg";
import GenderDark from "../assets/icons/gander-d.svg";
import CharacterLight from "../assets/icons/character.svg";
import CharacterDark from "../assets/icons/character-d.svg";
import SunLight from "../assets/icons/sun.svg";
import SunDark from "../assets/icons/sun-d.svg";
import MoonLight from "../assets/icons/moon.svg";
import MoonDark from "../assets/icons/moon-d.svg";
// nav chevron (matches Profile/Setup headers)
import PrevLight from "../assets/icons/prev.svg";
import PrevDark from "../assets/icons/prev-d.svg";
// gender row icons
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
  /** If true, screen is opened from Profile for editing; show back, hide CTA & Side row. */
  fromProfile?: boolean;
  onBack?: () => void;
}

const UNLOCKED_COUNT = 3;

const BuddySelection: React.FC<Props> = ({
  onNext,
  fromProfile = false,
  onBack,
}) => {
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
  const PrevIcon = isDark ? PrevDark : PrevLight;

  const [gender, setGender] = useState<Gender>(savedGender);
  const sexKey: SexKey = gender === "lady" ? "w" : "m";

  const [side, setSide] = useState<Side>(isDark ? "dark" : "bright");
  useEffect(() => setSide(isDark ? "dark" : "bright"), [isDark]);

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
        name: t("buddySelection.buddies.koala?.name", "Frenchie Freshbreath"),
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

  // name logic
  const defaultInitialName = buddies[initialIndex]?.name || buddies[0].name;
  const [nameEdited, setNameEdited] = useState<boolean>(!!savedBuddyName);
  const [buddyName, setBuddyNameLocal] = useState<string>(
    savedBuddyName || defaultInitialName
  );

  useEffect(() => {
    if (nameEdited && savedBuddyName) {
      setBuddyNameLocal(savedBuddyName);
    } else {
      const nextDefault = buddies[activeIndex]?.name ?? buddies[0].name;
      setBuddyNameLocal(nextDefault);
      setBuddyNameCtx(nextDefault);
    }
  }, [buddies, activeIndex, nameEdited, savedBuddyName, setBuddyNameCtx]);

  useEffect(() => {
    setSelectedBuddyId(buddies[initialIndex].id);
    if (!nameEdited) setBuddyNameCtx(defaultInitialName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Random backgrounds for cards
  const BGs = useMemo(
    () => [
      require("../assets/backgrounds/BG1.png"),
      require("../assets/backgrounds/BG2.png"),
      require("../assets/backgrounds/BG3.png"),
      require("../assets/backgrounds/BG4.png"),
      require("../assets/backgrounds/BG5.png"),
      require("../assets/backgrounds/BG6.png"),
    ],
    []
  );
  const buddyBGs = useMemo(
    () => buddies.map(() => BGs[Math.floor(Math.random() * BGs.length)]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [buddies.length, BGs]
  );

  const isLocked = (idx: number) => idx >= UNLOCKED_COUNT;
  const centerLocked = isLocked(activeIndex);
  const canProceed = !centerLocked;

  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";

  const handleConfirmName = (name: string) => {
    const finalName = (name || "").trim() || buddies[activeIndex].name;
    setBuddyNameLocal(finalName);
    setBuddyNameCtx(finalName);
    setNameEdited(true);
    setShowNameModal(false);
  };

  const handlePickSide = (s: Side) => {
    setSide(s);
    setTheme(s === "dark" ? "dark" : "light");
    setShowSideModal(false);
  };

  // Modals
  const [showNameModal, setShowNameModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showSideModal, setShowSideModal] = useState(false);

  return (
    <View
      className={`flex-1 ${
        isDark ? "bg-dark-background" : "bg-light-background"
      }`}
    >
      {/* Top back button (only in Profile edit mode) */}
      {fromProfile && onBack && (
        <View className="flex-row items-center justify-between px-6 pt-4 pb-1">
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
          <View style={{ width: 40, height: 40 }} />
        </View>
      )}

      {/* Header */}
      <View
        className={`${
          fromProfile ? "items-center mt-2" : "items-center pt-16"
        } px-6 mb-2`}
      >
        <Text
          className={`text-2xl font-bold mb-3 text-center ${
            isDark ? "text-slate-100" : "text-indigo-950"
          }`}
        >
          {fromProfile
            ? t("buddySelection.profileTitle", "My quit buddy")
            : t("buddySelection.title", "Pick your quit buddy")}
        </Text>

        {!fromProfile && (
          <Text
            className={`text-center font-medium leading-6 px-5 ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {t(
              "buddySelection.subtitle",
              "Choose your support animal to guide you on your journey!"
            )}
          </Text>
        )}
      </View>

      {/* Carousel */}
      <View className="mt-2">
        <BuddyCarousel
          data={buddies}
          sex={sexKey}
          isDark={isDark}
          isLocked={(i) => isLocked(i)}
          backgrounds={buddyBGs}
          onChange={(i) => {
            // In Profile edit mode, do not allow selecting locked ones
            if (fromProfile && isLocked(i)) return;
            setActiveIndex(i);
            setSelectedBuddyId(buddies[i].id);
            if (nameEdited && savedBuddyName) {
              setBuddyNameLocal(savedBuddyName);
            } else {
              const defaultName = buddies[i].name;
              setBuddyNameLocal(defaultName);
              setBuddyNameCtx(defaultName);
            }
          }}
        />
      </View>

      {/* Name & Description */}
      <Text
        className={`${
          isDark ? "text-slate-100" : "text-indigo-950"
        } text-center mt-8`}
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

      {/* Dots */}
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

      {/* Rows */}
      <View className="mt-6 px-6 gap-3">
        {/* Name */}
        <Pressable
          disabled={isLocked(activeIndex)}
          onPress={() => setShowNameModal(true)}
          className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
            isDark ? "bg-slate-700" : "bg-indigo-50"
          } ${isLocked(activeIndex) ? "opacity-60" : ""}`}
        >
          <View className="flex-row items-center">
            <Icons.Character width={20} height={20} color={systemIconColor} />
            <Text
              className={`ml-3 ${
                isDark ? "text-slate-100" : "text-indigo-950"
              }`}
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

        {/* Gender */}
        <Pressable
          onPress={() => setShowGenderModal(true)}
          className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
            isDark ? "bg-slate-700" : "bg-indigo-50"
          }`}
        >
          <View className="flex-row items-center">
            <Icons.Gender width={20} height={20} color={systemIconColor} />
            <Text
              className={`ml-3 ${
                isDark ? "text-slate-100" : "text-indigo-950"
              }`}
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

        {/* Side (only in onboarding mode) */}
        {!fromProfile && (
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
                className={`ml-3 ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontWeight: "600" }}
              >
                {side === "bright" ? "Bright side" : "Dark side"}
              </Text>
            </View>
            <Ionicons name="checkmark" size={18} color={systemIconColor} />
          </Pressable>
        )}
      </View>

      {/* CTA (only in onboarding mode) */}
      {!fromProfile && (
        <View className="px-6 pb-8 mt-6">
          <Pressable
            className={`rounded-2xl px-6 py-4 items-center justify-center flex-row ${
              canProceed ? "bg-indigo-600" : "bg-gray-400"
            }`}
            disabled={!canProceed}
            onPress={onNext}
          >
            <Text className="font-semibold text-xl mr-2 text-white">
              {t("buddySelection.next", "Let’s Go, Buddy!")}
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
          </Pressable>
          {!canProceed && (
            <Text
              className={`text-center mt-2 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              This buddy is locked. Unlock it in the shop soon.
            </Text>
          )}
        </View>
      )}

      {/* Modals */}
      <BuddyNameModal
        visible={showNameModal}
        isDark={isDark}
        initialName={buddyName}
        onConfirm={handleConfirmName}
        onClose={() => setShowNameModal(false)}
      />
      <GenderModal
        visible={showGenderModal}
        isDark={isDark}
        gender={gender}
        onSelect={(g) => {
          setGender(g);
          setGenderCtx(g);
          setShowGenderModal(false);
        }}
        onClose={() => setShowGenderModal(false)}
      />
      <SideModal
        visible={showSideModal}
        isDark={isDark}
        side={side}
        onSelect={handlePickSide}
        onClose={() => setShowSideModal(false)}
      />
    </View>
  );
};

export default BuddySelection;
