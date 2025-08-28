import SipAndBreathe from '../assets/strategies/sip-and-breathe.svg';
import WalkToReset from '../assets/strategies/walk-to-reset.svg';
import SnackInstead from '../assets/strategies/snack-instead.svg';
import MeditateAndListen from '../assets/strategies/meditate-listen.svg';
import SplashAndRefresh from '../assets/strategies/splash-refresh.svg';
import GripAndRelease from '../assets/strategies/grip-release.svg';
import CrumpleCravings from '../assets/strategies/crumple-cravings.svg';
import StretchAndRelax from '../assets/strategies/stretch-relax.svg';

export interface StrategyItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  challengeKey: string;
  daysKey: string;
  icon: React.ComponentType<any>;
  bgColor: string;
}

export const strategies: StrategyItem[] = [
  {
    id: 'sip-breathe',
    titleKey: 'cravingSOS.sipBreathe.title',
    descriptionKey: 'cravingSOS.sipBreathe.description',
    challengeKey: 'cravingSOS.sipBreathe.challenge',
    daysKey: 'cravingSOS.common.days',
    icon: SipAndBreathe,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'walk-reset',
    titleKey: 'cravingSOS.walkReset.title',
    descriptionKey: 'cravingSOS.walkReset.description',
    challengeKey: 'cravingSOS.walkReset.challenge',
    daysKey: 'cravingSOS.common.days',
    icon: WalkToReset,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'snack-instead',
    titleKey: 'cravingSOS.snackInstead.title',
    descriptionKey: 'cravingSOS.snackInstead.description',
    challengeKey: 'cravingSOS.snackInstead.challenge',
    daysKey: 'cravingSOS.common.days',
    icon: SnackInstead,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'meditate-listen',
    titleKey: 'cravingSOS.meditateListen.title',
    descriptionKey: 'cravingSOS.meditateListen.description',
    challengeKey: 'cravingSOS.meditateListen.challenge',
    daysKey: 'cravingSOS.common.days',
    icon: MeditateAndListen,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'splash-refresh',
    titleKey: 'cravingSOS.splashRefresh.title',
    descriptionKey: 'cravingSOS.splashRefresh.description',
    challengeKey: 'cravingSOS.splashRefresh.challenge',
    daysKey: 'cravingSOS.common.days',
    icon: SplashAndRefresh,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'grip-release',
    titleKey: 'cravingSOS.gripRelease.title',
    descriptionKey: 'cravingSOS.gripRelease.description',
    challengeKey: 'cravingSOS.gripRelease.challenge',
    daysKey: 'cravingSOS.common.days',
    icon: GripAndRelease,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'crumple-cravings',
    titleKey: 'cravingSOS.crumpleCravings.title',
    descriptionKey: 'cravingSOS.crumpleCravings.description',
    challengeKey: 'cravingSOS.crumpleCravings.challenge',
    daysKey: 'cravingSOS.common.days',
    icon: CrumpleCravings,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'stretch-relax',
    titleKey: 'cravingSOS.stretchRelax.title',
    descriptionKey: 'cravingSOS.stretchRelax.description',
    challengeKey: 'cravingSOS.stretchRelax.challenge',
    daysKey: 'cravingSOS.common.days',
    icon: StretchAndRelax,
    bgColor: 'bg-indigo-100',
  },
];


