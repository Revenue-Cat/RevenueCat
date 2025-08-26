import AsyncStorage from '@react-native-async-storage/async-storage';
// const AchievementBreatheIcon = require('../assets/achievements/achievement-breathe.png');
const AchievementSplashIcon = require('../assets/achievements/achievement-first-spark.png');
const AchievementHoldOnIcon = require('../assets/achievements/achievement-hold-on.png');
const AchievementSteelWeekIcon = require('../assets/achievements/achievement-steel-week.png');
const AchievementBrightMoonIcon = require('../assets/achievements/achievement-bright-moon.png');
const AchievementFreshPathIcon = require('../assets/achievements/achievement-fresh-path.png');
const AchievementFreedomIcon = require('../assets/achievements/achievement-freedom.png');
const AchievementHeroIcon = require('../assets/achievements/achievement-hero.png');
const AchievementLegendIcon = require('../assets/achievements/achievement-legend.png');
// const AchievementLockIcon = require('../assets/achievements/achievement-lock.png');

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  icon?: any;
  unlocked: boolean;
  notificationCount?: number;
  coins?: number;
  requiredDays: number;
  unlockedDate?: Date;
}

export interface UserProgress {
  startDate: Date | null;
  daysSmokeFree: number;
  totalMoneySaved: number;
  cigarettesAvoided: number;
  breathingExercisesCompleted: number;
  challengesCompleted: number;
  purchasesMade: number;
}

class AchievementService {
  private achievements: Map<string, Achievement> = new Map();
  private userProgress: UserProgress = {
    startDate: null,
    daysSmokeFree: 0,
    totalMoneySaved: 0,
    cigarettesAvoided: 0,
    breathingExercisesCompleted: 0,
    challengesCompleted: 0,
    purchasesMade: 0,
  };

  private subscribers: Set<() => void> = new Set();

  constructor() {
    this.initializeAchievements();
    this.loadUserProgress();
    
    // Update achievements based on existing start date if available
    if (this.userProgress.startDate) {
      this.updateAchievements();
    }
  }

  private initializeAchievements() {
    const REGULAR_ACHIEVEMENTS_DATA: Achievement[] = [
      {
        id: "first-spark",
        name: "First spark",
        description: "First 24 hours without smoke or vape — your start.",
        emoji: "🔥",
        icon: AchievementSplashIcon,
        unlocked: false,
        coins: 50,
        requiredDays: 1,
      },
      {
        id: "hold-on",
        name: "Hold On",
        description: "Three days smoke-free — proving your willpower.",
        emoji: "💪",
        icon: AchievementHoldOnIcon,
        unlocked: false,
        coins: 100,
        requiredDays: 3,
      },
      {
        id: "steel-week",
        name: "Steel week",
        description: "One week without nicotine — your strength grows.",
        emoji: "⚔️",
        icon: AchievementSteelWeekIcon,
        unlocked: false,
        coins: 150,
        requiredDays: 7,
      },
      {
        id: "bright-moon",
        name: "Bright moon",
        description: "Two weeks smoke-free — feel the change.",
        emoji: "🌙",
        icon: AchievementBrightMoonIcon,
        unlocked: false,
        coins: 200,
        requiredDays: 14,
      },
      {
        id: "fresh-path",
        name: "Fresh path",
        description: "A full month smoke-free — new habits forming.",
        emoji: "🌱",
        icon: AchievementFreshPathIcon,
        unlocked: false,
        coins: 300,
        requiredDays: 30,
      },
      {
        id: "freedom",
        name: "Freedom",
        description: "Three months without nicotine — enjoy your freedom.",
        emoji: "🕊️",
        icon: AchievementFreedomIcon,
        unlocked: false,
        coins: 500,
        requiredDays: 90,
      },
      {
        id: "hero",
        name: "Hero",
        description: "Half a year smoke-free — you are unstoppable.",
        emoji: "🦸",
        icon: AchievementHeroIcon,
        unlocked: false,
        coins: 750,
        requiredDays: 180,
      },
      {
        id: "legend",
        name: "Legend",
        description: "Almost a year without smoking — become a true legend.",
        emoji: "👑",
        icon: AchievementLegendIcon,
        unlocked: false,
        coins: 1000,
        requiredDays: 360,
      },
    ];

    REGULAR_ACHIEVEMENTS_DATA.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  // Subscribe to changes
  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify subscribers of changes
  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  // Set the start date when user begins their journey
  public async setStartDate(startDate: Date): Promise<void> {
    this.userProgress.startDate = startDate;
    await this.saveUserProgress();
    this.updateAchievements();
    this.notifySubscribers();
  }

  // Get the start date
  public getStartDate(): Date | null {
    return this.userProgress.startDate;
  }

  // Calculate days passed from start date
  public calculateDaysPassed(): number {
    if (!this.userProgress.startDate) {
      return 0;
    }

    const now = new Date();
    const startDate = new Date(this.userProgress.startDate);
    const timeDiff = now.getTime() - startDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    return Math.max(0, daysDiff);
  }

  // Update achievements based on current progress
  private updateAchievements(): void {
    const daysPassed = this.calculateDaysPassed();
    this.userProgress.daysSmokeFree = daysPassed;

    let hasChanges = false;
    const achievementIds = Array.from(this.achievements.keys());

    // First, unlock achievements that are done (progress = 100%)
    achievementIds.forEach((achievementId) => {
      const achievement = this.achievements.get(achievementId);
      if (!achievement) return;
            const shouldBeUnlocked = daysPassed >= achievement.requiredDays;

      console.log('shouldBeUnlocked', shouldBeUnlocked, daysPassed, achievement.requiredDays)

      if (shouldBeUnlocked && !achievement.unlocked) {
        // Unlock achievements that are done (progress = 100%)
        achievement.unlocked = true;
        achievement.unlockedDate = new Date();
        hasChanges = true;
      }
    });

    // Then, unlock the first 3 non-done achievements
    let unlockedCount = 0;
    achievementIds.forEach((achievementId) => {
      const achievement = this.achievements.get(achievementId);
      if (!achievement) return;
      
      const shouldBeUnlocked = daysPassed >= achievement.requiredDays;
      
      // If this achievement is not done and we haven't unlocked 3 yet
      if (!shouldBeUnlocked && unlockedCount < 3 && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedDate = undefined; // No unlock date for default unlocks
        unlockedCount++;
        hasChanges = true;
        console.log('Unlocking achievement:', achievementId, 'unlockedCount:', unlockedCount);
      } else if (!shouldBeUnlocked && achievement.unlocked && unlockedCount >= 3) {
        // Reset achievements that shouldn't be unlocked (for testing)
        achievement.unlocked = false;
        achievement.unlockedDate = undefined;
        hasChanges = true;
        console.log('Locking achievement:', achievementId, 'unlockedCount:', unlockedCount);
      }
    });

    if (hasChanges) {
      this.saveUserProgress();
    }
  }

  // Get all achievements
  public getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  // Get translated achievements
  public getTranslatedAchievements(t: (key: string) => string): Achievement[] {
    return Array.from(this.achievements.values()).map(achievement => ({
      ...achievement,
      name: t(`regularAchievements.${achievement.id}.name`),
      description: t(`regularAchievements.${achievement.id}.description`)
    }));
  }

  // Get achievements by category (for compatibility)
  public getAchievementsByCategory(category: string): Achievement[] {
    // For now, return all regular achievements
    return this.getAllAchievements();
  }

  // Get user progress
  public getUserProgress(): UserProgress {
    return { ...this.userProgress };
  }

  // Get progress for a specific achievement
  public getProgressForAchievement(achievementId: string): { current: number; max: number; percentage: number } {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) {
      return { current: 0, max: 1, percentage: 0 };
    }

    const daysPassed = this.calculateDaysPassed();
    const current = Math.min(daysPassed, achievement.requiredDays);
    const max = achievement.requiredDays;
    const percentage = Math.min((current / max) * 100, 100);

    console.log('Progress for', achievementId, ':', { current, max, percentage, daysPassed });

    return { current, max, percentage };
  }

  // Load user progress from storage
  private async loadUserProgress(): Promise<void> {
    try {
      const storedProgress = await AsyncStorage.getItem('userProgress');
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        this.userProgress = {
          ...this.userProgress,
          ...parsed,
          startDate: parsed.startDate ? new Date(parsed.startDate) : null,
        };
      }

      // Load achievement states
      const storedAchievements = await AsyncStorage.getItem('achievements');
      if (storedAchievements) {
        const parsed = JSON.parse(storedAchievements);
        this.achievements.forEach(achievement => {
          const stored = parsed[achievement.id];
          if (stored) {
            achievement.unlocked = stored.unlocked || false;
            achievement.unlockedDate = stored.unlockedDate ? new Date(stored.unlockedDate) : undefined;
          }
        });
      }

      this.updateAchievements();
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }

  // Save user progress to storage
  private async saveUserProgress(): Promise<void> {
    try {
      await AsyncStorage.setItem('userProgress', JSON.stringify({
        ...this.userProgress,
        startDate: this.userProgress.startDate?.toISOString(),
      }));

      // Save achievement states
      const achievementStates: Record<string, any> = {};
      this.achievements.forEach(achievement => {
        achievementStates[achievement.id] = {
          unlocked: achievement.unlocked,
          unlockedDate: achievement.unlockedDate?.toISOString(),
        };
      });
      await AsyncStorage.setItem('achievements', JSON.stringify(achievementStates));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  // Reset all progress (for testing)
  public async resetProgress(): Promise<void> {
    this.userProgress = {
      startDate: null,
      daysSmokeFree: 0,
      totalMoneySaved: 0,
      cigarettesAvoided: 0,
      breathingExercisesCompleted: 0,
      challengesCompleted: 0,
      purchasesMade: 0,
    };

    this.achievements.forEach(achievement => {
      achievement.unlocked = false;
      achievement.unlockedDate = undefined;
    });

    await this.saveUserProgress();
    this.notifySubscribers();
  }

}

// Export singleton instance
export const achievementService = new AchievementService();
