import { buddyAssets } from '../assets/buddies';

export interface Buddy {
  id: string;
  emoji: string;
  name: string;
  description: string;
  coin: number;
  icon: any;
  previewIcon?: any;
  owned: boolean;
  type: 'character';
}

export const BUDDIES_DATA: Buddy[] = [
  {
    id: "zebra-m",
    emoji: "🦓",
    name: "ZebraBro",
    description: "Run with me, and we'll leave smoke behind faster than it can catch us.",
    coin: 100,
    icon: buddyAssets.zebra.m,
    owned: false,
    type: 'character'
  },
  {
    id: "dog-m",
    emoji: "🐶",
    name: "SpudDog",
    description: "Stick with me — we'll beat smoke faster than it thinks.",
    coin: 100,
    icon: buddyAssets.dog.m,
    owned: false,
    type: 'character'
  },
  {
    id: "fox-m",
    emoji: "🦊",
    name: "GingerBoss",
    description: "With two clever heads, smoke stands no chance — we'll quit twice as fast.",
    coin: 100,
    icon: buddyAssets.fox.m,
    owned: false,
    type: 'character'
  },
  {
    id: "alpaca-m",
    emoji: "🦙",
    name: "Lamburger",
    description: "Climb with me — and we'll reach the smoke-free top faster than we think.",
    coin: 100,
    icon: buddyAssets.alpaca.m,
    owned: false,
    type: 'character'
  },
  {
    id: "koala-m",
    emoji: "🐨",
    name: "Don Snooze",
    description: "Embrace life with me — and we'll shake off smoke faster than it can cling.",
    coin: 100,
    icon: buddyAssets.koala.m,
    owned: false,
    type: 'character'
  },
  {
    id: "dog-w",
    emoji: "🐶",
    name: "SpudQueen",
    description: "Together we shine brighter, and quitting smoke gets easier and faster.",
    coin: 100,
    icon: buddyAssets.dog.w,
    owned: false,
    type: 'character'
  },
  {
    id: "alpaca-w",
    emoji: "🦙",
    name: "Lamazing",
    description: "Side by side we'll breathe fresh air and chase smoke away in no time.",
    coin: 100,
    icon: buddyAssets.alpaca.w,
    owned: false,
    type: 'character'
  },
  {
    id: "fox-w",
    emoji: "🦊",
    name: "FoxyBossy",
    description: "Let's outsmart smoke together — the two of us will finish this game fast.",
    coin: 100,
    icon: buddyAssets.fox.w,
    owned: false,
    type: 'character'
  },
  {
    id: "koala-w",
    emoji: "🐨",
    name: "NapCutie",
    description: "Together we'll find peace — and leave smoke far behind much faster.",
    coin: 100,
    icon: buddyAssets.koala.w,
    owned: false,
    type: 'character'
  },
  {
    id: "zebra-w",
    emoji: "🦓",
    name: "Zebrabelle",
    description: "If we dream side by side, smoke will disappear twice as fast.",
    coin: 100,
    icon: buddyAssets.zebra.w,
    owned: false,
    type: 'character'
  }
];

// Helper function to get buddy by ID
export const getBuddyById = (id: string): Buddy | undefined => {
  return BUDDIES_DATA.find(buddy => buddy.id === id);
};
