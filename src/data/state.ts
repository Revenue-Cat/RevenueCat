import { Scene, SCENES_DATA } from "./scenesData";

export interface ShopItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  owned: boolean;
  isNew?: boolean;
}

export const DEFAULT_CHARACTER: ShopItem = {
  id: "1",
  emoji: "🦫",
  name: "Chill Capybara",
  price: 0,
  owned: true,
};

export const DEFAULT_BACKGROUND: Scene = SCENES_DATA[0]; // Use the first scene as default

export const DEFAULT_STATE = {
    userCoins: 0,
    selectedBuddy: DEFAULT_CHARACTER,
    selectedBackground: DEFAULT_BACKGROUND,
    ownedBuddies: ["llama-m", "llama-w", "zebra-m", "zebra-w", "dog-m", "dog-w"],
    ownedBackgrounds: ["bg1", "bg3"],
    ownedAccessories: [],
    gender: "man",
    selectedBuddyId: "llama-m",
    buddyName: "Llama Calmington",
    smokeType: "",
    dailyAmount: "",
    packPrice: "",
    packPriceCurrency: "$",
    goal: "",
    userProgress: {
        startDate: null,
        daysSmokeFree: 0,
        totalMoneySaved: 0,
        cigarettesAvoided: 0,
        breathingExercisesCompleted: 0,
        challengesCompleted: 0,
        purchasesMade: 0,
    },
    activeChallenges: [],
    inProgressChallenges: [],
    challengeProgress: {},
    challengeCompletions: {},
    dailyCheckIns: {},
    slipsUsed: 0,
    slipsDates: [],
    extraSlipPacks: 0,
    }