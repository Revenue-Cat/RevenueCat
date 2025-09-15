import { buddyAssets } from '../assets/buddies';

import Bear from '../assets/buddies/placeholders/Bear.svg';
import Bunny from '../assets/buddies/placeholders/Bunny.svg';
import Cat from '../assets/buddies/placeholders/Cat.svg';
import Duck from '../assets/buddies/placeholders/Duck.svg';
import Hedgehog from '../assets/buddies/placeholders/Hedgehog.svg';
import Monkey from '../assets/buddies/placeholders/Monkey.svg';
import Owl from '../assets/buddies/placeholders/Owl.svg';
import Penguin from '../assets/buddies/placeholders/Penguin.svg';
import Tiger from '../assets/buddies/placeholders/Tiger.svg';

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

export const PLACEHOLDER_BUDDY: Buddy[] = [
   {
    id: "bear",
    emoji: "🦓",
    name: "Bear",
    description: "With my strength by your side, we'll conquer smoke stronger than ever before.",
    coin: 250,
    icon: Bear,
    owned: false,
    type: 'character'
  },
  {
    id: "bunny",
    emoji: "🐰",
    name: "Bunny",
    description: "Hop with me into a smoke-free life — we'll bounce away from cravings together.",
    coin: 250,
    icon: Bunny,
    owned: false,
    type: 'character'
  },
  {
    id: "cat",
    emoji: "🐱",
    name: "Cat",
    description: "My curiosity will guide us — together we'll explore a smoke-free world faster.",
    coin: 250,
    icon: Cat,
    owned: false,
    type: 'character'
  },
  {
    id: "hedgehog",
    emoji: "🦔",
    name: "Hedgehog",
    description: "With my protective nature, we'll shield ourselves from smoke and emerge victorious.",
    coin: 250,
    icon: Hedgehog,
    owned: false,
    type: 'character'
  },
  {
    id: "monkey",
    emoji: "🐒",
    name: "Monkey",
    description: "Swing with me through challenges — we'll conquer smoke with playful determination.",
    coin: 250,
    icon: Monkey,
    owned: false,
    type: 'character'
  },
  {
    id: "owl",
    emoji: "🦉",
    name: "Owl",
    description: "My wisdom lights the way — together we'll see through smoke to freedom.",
    coin: 250,
    icon: Owl,
    owned: false,
    type: 'character'
  },
  {
    id: "penguin",
    emoji: "🐧",
    name: "Penguin",
    description: "Waddle with me through the cold — we'll brave smoke and emerge stronger together.",
    coin: 250,
    icon: Penguin,
    owned: false,
    type: 'character'
  },
  {
    id: "tiger",
    emoji: "🐯",
    name: "Tiger",
    description: "Roar with me against smoke — our combined strength will defeat it faster than ever.",
    coin: 250,
    icon: Tiger,
    owned: false,
    type: 'character'
  }
];

export const BUDDIES_DATA: Buddy[] = [
  {
    id: "zebra-m",
    emoji: "🦓",
    name: "ZebraBro",
    description: "Run with me, and we'll leave smoke behind faster than it can catch us.",
    coin: 250,
    icon: buddyAssets.zebra.m,
    owned: false,
    type: 'character'
  },
  {
    id: "dog-m",
    emoji: "🐶",
    name: "SpudDog",
    description: "Stick with me — we'll beat smoke faster than it thinks.",
    coin: 250,
    icon: buddyAssets.dog.m,
    owned: false,
    type: 'character'
  },
  {
    id: "fox-m",
    emoji: "🦊",
    name: "GingerBoss",
    description: "With two clever heads, smoke stands no chance — we'll quit twice as fast.",
    coin: 250,
    icon: buddyAssets.fox.m,
    owned: false,
    type: 'character'
  },
  {
    id: "llama-m",
    emoji: "🦙",
    name: "Lamburger",
    description: "Climb with me — and we'll reach the smoke-free top faster than we think.",
    coin: 250,
    icon: buddyAssets.llama.m,
    owned: false,
    type: 'character'
  },
  {
    id: "koala-m",
    emoji: "🐨",
    name: "Don Snooze",
    description: "Embrace life with me — and we'll shake off smoke faster than it can cling.",
    coin: 250,
    icon: buddyAssets.koala.m,
    owned: false,
    type: 'character'
  },
  {
    id: "dog-w",
    emoji: "🐶",
    name: "SpudQueen",
    description: "Together we shine brighter, and quitting smoke gets easier and faster.",
    coin: 250,
    icon: buddyAssets.dog.w,
    owned: false,
    type: 'character'
  },
  {
    id: "llama-w",
    emoji: "🦙",
    name: "Lamazing",
    description: "Side by side we'll breathe fresh air and chase smoke away in no time.",
    coin: 250,
    icon: buddyAssets.llama.w,
    owned: false,
    type: 'character'
  },
  {
    id: "fox-w",
    emoji: "🦊",
    name: "FoxyBossy",
    description: "Let's outsmart smoke together — the two of us will finish this game fast.",
    coin: 250,
    icon: buddyAssets.fox.w,
    owned: false,
    type: 'character'
  },
  {
    id: "koala-w",
    emoji: "🐨",
    name: "NapCutie",
    description: "Together we'll find peace — and leave smoke far behind much faster.",
    coin: 250,
    icon: buddyAssets.koala.w,
    owned: false,
    type: 'character'
  },
  {
    id: "zebra-w",
    emoji: "🦓",
    name: "Zebrabelle",
    description: "If we dream side by side, smoke will disappear twice as fast.",
    coin: 250,
    icon: buddyAssets.zebra.w,
    owned: false,
    type: 'character'
  }
];

// Helper function to get buddy by ID
export const getBuddyById = (id: string): Buddy | undefined => {
  return BUDDIES_DATA.find(buddy => buddy.id === id);
};

// Helper function to get translated buddy data
export const getTranslatedBuddyData = (t: (key: string) => string): Buddy[] => {
  return BUDDIES_DATA.map(buddy => ({
    ...buddy,
    name: t(`buddies.${buddy.id}.name`),
    description: t(`buddies.${buddy.id}.description`)
  }));
};
