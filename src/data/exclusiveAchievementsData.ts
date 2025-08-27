const AchievementBreatheIcon = require('../assets/achievements/achievement-breathe.png');
const AchievementLockedIcon = require('../assets/achievements/achievement-locked.png');

export interface ExclusiveAchievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  icon?: any;
  unlocked: boolean;
  notificationCount?: number;
  coins?: number;
  requiredDays: number;
}

// Exclusive Achievements Data
export const EXCLUSIVE_ACHIEVEMENTS_DATA: ExclusiveAchievement[] = [
  {
    id: "breathe",
    name: "Breathe",
    description: "Complete your first breathing exercise session",
    emoji: "🦙",
    icon: AchievementBreatheIcon,
    unlocked: true,
    notificationCount: 13,
    coins: 100,
    requiredDays: 1
  },
  {
    id: "hydro-win",
    name: "HydroWin",
    description: "Drink 8 glasses of water for 7 days straight",
    emoji: "💧",
    icon: AchievementBreatheIcon,
    unlocked: true,
    notificationCount: 5,
    coins: 150,
    requiredDays: 7
  },
  {
    id: "strider",
    name: "Strider",
    description: "Take 10,000 steps for 5 consecutive days",
    emoji: "🚶",
    icon: AchievementBreatheIcon,
    unlocked: true,
    notificationCount: 2,
    coins: 200,
    requiredDays: 5
  },
  {
    id: "snackcess",
    name: "Snackcess",
    description: "Choose healthy snacks over junk food for a week",
    emoji: "🥗",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 100,
    requiredDays: 7
  },
  {
    id: "zen",
    name: "Zen",
    description: "Complete 10 meditation sessions",
    emoji: "🧘",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 150,
    requiredDays: 10
  },
  {
    id: "gripped",
    name: "Gripped",
    description: "Hold a plank for 2 minutes",
    emoji: "💪",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 200,
    requiredDays: 1
  },
  {
    id: "splash",
    name: "Splash",
    description: "Swim 20 laps in one session",
    emoji: "🏊",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 250,
    requiredDays: 1
  },
  {
    id: "crave-crusher",
    name: "Crave Crusher",
    description: "Practice stress relief techniques",
    emoji: "🧘",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 100,
    requiredDays: 1
  },
  {
    id: "flow-minute",
    name: "Flow Minute",
    description: "Complete daily stretching routine",
    emoji: "🧘",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 150,
    requiredDays: 1
  }
];
