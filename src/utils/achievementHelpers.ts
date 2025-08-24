// Helper function to identify regular achievements
export const isRegularAchievement = (achievementId: string): boolean => {
  const regularAchievementIds = [
    'first-spark',
    'hold-on', 
    'steel-week',
    'bright-moon',
    'fresh-path',
    'freedom',
    'hero',
    'legend'
  ];
  return regularAchievementIds.includes(achievementId);
};

// Helper function to check if achievement is in first 3 (excluding 100% progress achievements)
export const isFirstThreeAchievement = (achievementId: string, getProgressForAchievement: any): boolean => {
  const regularAchievementIds = [
    'first-spark',
    'hold-on', 
    'steel-week',
    'bright-moon',
    'fresh-path',
    'freedom',
    'hero',
    'legend'
  ];
  
  // Filter regular achievements that don't have 100% progress
  const nonCompletedRegularAchievements = regularAchievementIds.filter(id => {
    const progress = getProgressForAchievement(id);
    return progress.percentage < 100;
  });
  
  // Take the first 3 non-completed regular achievements
  const firstThreeNonCompleted = nonCompletedRegularAchievements.slice(0, 3);
  
  return firstThreeNonCompleted.includes(achievementId);
};

// Helper function to calculate the target date for achievement countdown
export const calculateAchievementTargetDate = (startDate: Date | null, requiredDays: number): Date => {
  if (!startDate) return new Date();
  
  const targetDate = new Date(startDate);
  targetDate.setDate(targetDate.getDate() + requiredDays);
  
  return targetDate;
};

// Helper function to calculate remaining days for achievement
export const calculateRemainingDays = (startDate: Date | null, requiredDays: number): number => {
  if (!startDate) return requiredDays;
  
  const now = new Date();
  const targetDate = calculateAchievementTargetDate(startDate, requiredDays);
  const timeDiff = targetDate.getTime() - now.getTime();
  const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return Math.max(0, remainingDays);
};
