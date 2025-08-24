import React from 'react';
import SlideModal from './SlideModal';
import { Achievement } from '../services/achievementService';
import { useApp } from '../contexts/AppContext';
import AchievementModalContent from './AchievementModalContent';
import AchievementModalActions from './AchievementModalActions';

interface AchievementModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
  onShare?: (achievement: Achievement) => void;
  progress?: any;
  getProgressForAchievement?: (achievementId: string) => { current: number; max: number; percentage: number };
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  achievement,
  onClose,
  progress,
  getProgressForAchievement
}) => {
  const { startDate } = useApp();

  if (!achievement) return null;

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={""}
      showCloseButton={false}
      confirmText="Share"
    >
      <AchievementModalContent
        achievement={achievement}
        progress={progress}
        getProgressForAchievement={getProgressForAchievement}
        startDate={startDate}
      />
      
      <AchievementModalActions
        achievement={achievement}
        progress={progress}
        onClose={onClose}
      />
    </SlideModal>
  );
};

export default AchievementModal;
