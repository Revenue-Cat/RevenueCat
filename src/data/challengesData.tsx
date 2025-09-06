import Challenge1Icon from '../assets/challenges/challenge1.svg';
import { ChallengeCardProps } from '../components/ChallengeCard';

import MasterOfAirWater from '../assets/challenges/master-of-air-water.svg';
import MasterOfAirWaterIcon from '../assets/challenges/master-of-air-water-icon.svg';

import MasterOfAirIcon from '../assets/challenges/master-of-air-icon.svg';
import MasterOfAir from '../assets/challenges/master-of-air.svg';

import MasterOfAirWalk from '../assets/challenges/master-of-air-walk.svg';
import MasterOfAirWalkIcon from '../assets/challenges/master-of-air-walk-icon.svg';

import SnackBreak from '../assets/challenges/snack-break.svg';
import SnackBreakIcon from '../assets/challenges/snack-break-icon.svg';

import CalmPower from '../assets/challenges/calm-power.svg';
import CalmPowerIcon from '../assets/challenges/calm-power-icon.svg';

import FistFlow from '../assets/challenges/fist-flow.svg';
import FistFlowIcon from '../assets/challenges/fist-flow-icon.svg';

import Refresh from '../assets/challenges/refresh.svg';
import RefreshIcon from '../assets/challenges/refresh-icon.svg';

import CraveCrusher from '../assets/challenges/crave-crusher.svg';
import CraveCrusherIcon from '../assets/challenges/crave-crusher-icon.svg';

import FlowMinute from '../assets/challenges/flow-minute.svg';
import FlowMinuteIcon from '../assets/challenges/flow-minute-icon.svg';


import React from 'react';

export interface ChallengeData {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  motivation: string[];
  buddyAdvice: string[];
  achievement: string;
  achievementDescription: string;
  duration: string;
  totalDurations: number; // Duration in days for progress calculation
  hasImage: boolean;
  hasAchievement: boolean;
  cardAdvice?: string;
  cardAdviceDescription?: string;
  cardIcon?: any;
  icon?: any;
  unitWord: string; // Word to display for tracking (e.g., "Glasses", "Times", "Walks")
}

export const CHALLENGES_DATA: ChallengeData[] = [
  {
    id: 'master-of-air-breathing',
    title: 'Master of air',
    shortDescription: 'Practice 5 deep breaths.',
    longDescription: 'Practice 5 deep breaths, three times a day for 10 days.',
    motivation: [
      'Reduces stress and anxiety',
      'Lowers cravings naturally',
      'Increases focus and calm',
      'Boosts energy'
    ],
    buddyAdvice: [
      'Take a slow, deep inhale and exhale.',
      'Focus on the sensations of your breathing.',
      'Repeat 5 times.',
      'Do this daily for 10 days.'
    ],
    achievement: 'AirMind',
    achievementDescription: 'You completed 10 days of mindful breathing and beat cravings with calm.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardIcon: <MasterOfAir />,
    icon: <MasterOfAirIcon />,
    unitWord: 'Times'
  },
  {
    id: 'master-of-air-water',
    title: 'Hydration boost',
    shortDescription: 'Drink water each craving.',
    longDescription: 'Drink a glass of water every time you feel a craving for 10 days.',
    motivation: [
      'Reduces nicotine craving intensity.',
      'Flushes toxins from your body.',
      'Maintains energy and focus.',
      'Improves skin health.'
    ],
    buddyAdvice: [
      'Replace the craving with a glass of water.',
      'Slowly drink the water, focusing on the taste and sensations.',
      'Take a few deep breaths and relax.',
      'If the craving returns — repeat the steps.',
      'Repeat daily for 10 days.'
    ],
    achievement: 'HydroWin',
    achievementDescription: 'Drink a glass of water in mindful sips, feeling each one.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardAdvice: 'Sip and breathe',
    cardIcon: <MasterOfAirWater />,
    icon: <MasterOfAirWaterIcon />,
    cardAdviceDescription: 'Replace the craving with a glass of water. Slowly drink the water, focusing on the taste and sensations. Take a few deep breaths and relax. If the craving returns — repeat the steps.',
    unitWord: 'Glasses'
  },
  {
    id: 'master-of-air-walk',
    title: 'Step slayer',
    shortDescription: 'Walk 500 steps to reset.',
    longDescription: 'Walk 500 steps each day to clear your mind and reset your body.',
    motivation: [
      'Reduces stress and anxiety.',
      'Boosts circulation and energy.',
      'Helps control cravings.',
      'Improves mood and focus.'
    ],
    buddyAdvice: [
      'Take short mindful walks instead of smoking.',
      'Focus on your breath and steps.',
      'Use it as a mini-break to refresh your mind.',
      'If the craving returns — walk again.',
      'Repeat daily for 10 days.'
    ],
    achievement: 'Strider',
    achievementDescription: 'You stayed smoke-free and strong with 10 days of mindful steps.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardAdvice: 'Walk to reset',
    cardAdviceDescription: 'When you feel the urge to smoke, walk 500 steps to clear your mind and reset your body. This helps distract you from cravings and feel in control.',
    cardIcon: <MasterOfAirWalk />,
    icon: <MasterOfAirWalkIcon />,
    unitWord: 'Walks'
  },
  {
    id: 'snack-break',
    title: 'Snack break',
    shortDescription: 'Snack instead of smoking.',
    longDescription: 'Choose a healthy snack instead of lighting a cigarette.',
    motivation: [
      'Reduces cravings naturally.',
      'Keeps your mouth and hands busy.',
      'Provides energy and nutrients.',
      'Builds a healthier habit.'
    ],
    buddyAdvice: [
      'Keep fruits, nuts, or veggies nearby.',
      'When the urge hits — chew slowly, focus on taste and texture.',
      'Pair the snack with a glass of water.',
      'If craving returns — repeat the step.',
      'Repeat daily for 10 days.'
    ],
    achievement: 'Snackcess',
    achievementDescription: 'You stayed smoke-free for 10 days by choosing healthy bites over cigarettes.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardAdvice: 'Snack instead',
    cardAdviceDescription: 'When you feel the urge to smoke, grab a healthy snack instead. Chew slowly, focus on the taste and texture, and take a sip of water. If the craving comes back, repeat the steps.',
    cardIcon: <SnackBreak />,
    icon: <SnackBreakIcon />,
    unitWord: 'Snacks'
  },
  {
    id: 'calm-power',
    title: 'Calm power',
    shortDescription: 'Meditate 2 minutes.',
    longDescription: 'Do a 2-minute meditation every time you feel a craving to smoke.',
    motivation: [
      'Reduces stress and tension.',
      'Helps manage nicotine cravings.',
      'Improves focus and mindfulness.'
    ],
    buddyAdvice: [
      'Sit comfortably and close your eyes.',
      'Take slow, deep breaths and focus on the sensations.',
      'If your mind wanders, gently bring attention back to your breath.',
      'Repeat each time a craving arises.',
      'Repeat daily for 10 days.'
    ],
    achievement: 'Zen',
    achievementDescription: 'You completed 10 days of mindful meditation with music to manage cravings.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardAdvice: 'Meditate and listen',
    cardAdviceDescription: 'Replace a craving with a short meditation and music. Focus on your breathing, relax your body, and let the craving pass.',
    cardIcon: <CalmPower />,
    icon: <CalmPowerIcon />,
    unitWord: 'Sessions'
  },
  {
    id: 'fist-flow',
    title: 'Fist flow',
    shortDescription: 'Squeeze 20 times.',
    longDescription: 'Squeeze and release your fists 20 times to beat cravings.',
    motivation: [
      'Reduces nicotine cravings.',
      'Releases tension and stress.',
      'Provides a physical outlet for urges.'
    ],
    buddyAdvice: [
      'Make a fist and squeeze tightly 20 times.',
      'Focus on the sensations in your hands and arms.',
      'Breathe deeply and relax.',
      'Repeat whenever cravings arise.',
      'Repeat daily for 10 days.'
    ],
    achievement: 'Gripped',
    achievementDescription: 'You squeezed and released your fists for 10 days to beat cravings.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardAdvice: 'Grip and release',
    cardAdviceDescription: 'When you feel a craving, squeeze and release your fists 20 times. Focus on the sensations, breathe deeply, and let the urge pass. Repeat if needed.',
    icon: <FistFlowIcon />,
    cardIcon: <FistFlow />,
    unitWord: 'Squeezes'
  },
  {
    id: 'refresh',
    title: 'Refresh',
    shortDescription: 'Splash water to curb cravings.',
    longDescription: 'Splash cold water to curb cravings instantly.',
    motivation: [
      'Reduces nicotine cravings.',
      'Refreshes and energizes.',
      'Resets focus.'
    ],
    buddyAdvice: [
      'Splash cold water on your face or wrists.',
      'Take a deep breath and relax.',
      'Repeat if cravings return.',
      'Repeat daily for 10 days.'
    ],
    achievement: 'Splash',
    achievementDescription: 'You completed 10 days of instant cold-water resets instead of cravings.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardAdvice: 'Splash and refresh',
    cardAdviceDescription: 'When you feel the urge to smoke, splash cold water on your face or wrists. Breathe deeply, focus on the sensations, and let your body refresh. If the craving returns, repeat the steps.',
    cardIcon: <Refresh />,
    icon: <RefreshIcon />,
    unitWord: 'Splashes'
  },
  {
    id: 'crave-crusher',
    title: 'Crave crusher',
    shortDescription: 'Crumple your craving.',
    longDescription: 'Draw or write down your craving, then crumple it to release the urge.',
    motivation: [
      'Helps you acknowledge and release cravings.',
      'Reduces stress and tension.',
      'Provides a physical action to break the habit loop.'
    ],
    buddyAdvice: [
      'Take a piece of paper and draw your craving for a cigarette or write it down.',
      'Focus on the feeling as you create it.',
      'Crumple the paper into a ball.',
      'Take a deep breath and let it go.',
      'Repeat whenever cravings arise.',
      'Repeat daily for 10 days.'
    ],
    achievement: 'Released',
    achievementDescription: 'You drew or wrote your cravings and crushed them for 10 days.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardAdvice: 'Crumple cravings',
    cardAdviceDescription: 'When you feel the urge to smoke, draw or write your craving on a piece of paper. Focus on the feeling, then crumple the paper. Breathe deeply and let the craving go. If it comes back, repeat the steps.',
    cardIcon: <CraveCrusher />,
    icon: <CraveCrusherIcon />,
    unitWord: 'Crumples'
  },
  {
    id: 'flow-minute',
    title: 'Flow minute',
    shortDescription: 'Stretch to release tension.',
    longDescription: 'Gently stretch your neck, shoulders, and back for 2–3 minutes to release tension.',
    motivation: [
      'Reduces stress and muscle tightness.',
      'Improves posture and circulation.',
      'Boosts focus and relaxation.'
    ],
    buddyAdvice: [
      'Sit or stand comfortably.',
      'Slowly stretch your neck, shoulders, and back for 2–3 minutes.',
      'Breathe deeply and feel the tension release.',
      'Repeat whenever you feel tight or stressed.',
      'Repeat daily for 10 days.'
      ],
    
    achievement: 'Stretched',
    achievementDescription: 'You stretched and released tension for 10 days.',
    duration: '10 Days',
    totalDurations: 10,
    hasImage: true,
    hasAchievement: true,
    cardAdvice: 'Stretch and relax',
    cardAdviceDescription: 'When you feel tension or stiffness, gently stretch your neck, shoulders, and back for 2–3 minutes. Breathe deeply, focus on the sensations, and let your body relax. If tension returns, repeat the steps.',
    cardIcon: <FlowMinute />,
    icon: <FlowMinuteIcon />,
    unitWord: 'Stretches'
  }
];

// Helper function to convert ChallengeData to ChallengeCardProps
export const convertToChallengeCardProps = (challenge: ChallengeData, status: 'active' | 'locked' | 'inprogress' = 'locked', progress?: number, streak?: number, checkIns?: number): ChallengeCardProps => ({
  id: challenge.id,
  title: challenge.title,
  description: challenge.shortDescription,
  points: 100,
  duration: challenge.duration,
  icon: challenge.icon,
  status,
  progress,
  streak,
  checkIns,
  cardIcon: challenge.cardIcon,
  motivation: challenge.motivation,
  buddyAdvice: challenge.buddyAdvice,
  unitWord: challenge.unitWord,
  totalDurations: challenge.totalDurations
});
