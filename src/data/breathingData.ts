export interface BreathingAssets {
  slide1: any;
  slide2: any;
  slide3: any;
  buddyIcon: any;
}

export interface BreathingExerciseData {
  id: string;
  assets: BreathingAssets;
}

// Import all breathing assets
const zebraMSlide1 = require('../assets/breathing/zebra/slide1.png');
const zebraMSlide2 = require('../assets/breathing/zebra/slide2.png');
const zebraMSlide3 = require('../assets/breathing/zebra/slide3.png');
const zebraMBuddyIcon = require('../assets/breathing/zebra/zebra.png');

const dogMSlide1 = require('../assets/breathing/dog/slide1.png');
const dogMSlide2 = require('../assets/breathing/dog/slide2.png');
const dogMSlide3 = require('../assets/breathing/dog/slide3.png');
const dogMBuddyIcon = require('../assets/breathing/dog/dog.png');

const foxMSlide1 = require('../assets/breathing/fox/slide1.png');
const foxMSlide2 = require('../assets/breathing/fox/slide2.png');
const foxMSlide3 = require('../assets/breathing/fox/slide3.png');
const foxMBuddyIcon = require('../assets/breathing/fox/fox.png');

const llamaMSlide1 = require('../assets/breathing/llama/slide1.png');
const llamaMSlide2 = require('../assets/breathing/llama/slide2.png');
const llamaMSlide3 = require('../assets/breathing/llama/slide3.png');
const llamaMBuddyIcon = require('../assets/breathing/llama/llama.png');

const koalaMSlide1 = require('../assets/breathing/koala/slide1.png');
const koalaMSlide2 = require('../assets/breathing/koala/slide2.png');
const koalaMSlide3 = require('../assets/breathing/koala/slide3.png');
const koalaMBuddyIcon = require('../assets/breathing/koala/koala.png');

const dogWSlide1 = require('../assets/breathing/dog_w/slide1.png');
const dogWSlide2 = require('../assets/breathing/dog_w/slide2.png');
const dogWSlide3 = require('../assets/breathing/dog_w/slide3.png');
const dogWBuddyIcon = require('../assets/breathing/dog_w/dog.png');

const llamaWSlide1 = require('../assets/breathing/llama_w/slide1.png');
const llamaWSlide2 = require('../assets/breathing/llama_w/slide2.png');
const llamaWSlide3 = require('../assets/breathing/llama_w/slide3.png');
const llamaWBuddyIcon = require('../assets/breathing/llama_w/llama.png');

const foxWSlide1 = require('../assets/breathing/fox_w/slide1.png');
const foxWSlide2 = require('../assets/breathing/fox_w/slide2.png');
const foxWSlide3 = require('../assets/breathing/fox_w/slide3.png');
const foxWBuddyIcon = require('../assets/breathing/fox_w/fox.png');

const koalaWSlide1 = require('../assets/breathing/koala_w/slide1.png');
const koalaWSlide2 = require('../assets/breathing/koala_w/slide2.png');
const koalaWSlide3 = require('../assets/breathing/koala_w/slide3.png');
const koalaWBuddyIcon = require('../assets/breathing/koala_w/koala.png');

const zebraWSlide1 = require('../assets/breathing/zebra_w/slide1.png');
const zebraWSlide2 = require('../assets/breathing/zebra_w/slide2.png');
const zebraWSlide3 = require('../assets/breathing/zebra_w/slide3.png');
const zebraWBuddyIcon = require('../assets/breathing/zebra_w/zebra.png');

export const BREATHING_EXERCISE_DATA: BreathingExerciseData[] = [
  {
    id: "zebra-m",
    assets: {
      slide1: zebraMSlide1,
      slide2: zebraMSlide2,
      slide3: zebraMSlide3,
      buddyIcon: zebraMBuddyIcon,
    }
  },
  {
    id: "dog-m",
    assets: {
      slide1: dogMSlide1,
      slide2: dogMSlide2,
      slide3: dogMSlide3,
      buddyIcon: dogMBuddyIcon,
    }
  },
  {
    id: "fox-m",
    assets: {
      slide1: foxMSlide1,
      slide2: foxMSlide2,
      slide3: foxMSlide3,
      buddyIcon: foxMBuddyIcon,
    }
  },
  {
    id: "llama-m",
    assets: {
      slide1: llamaMSlide1,
      slide2: llamaMSlide2,
      slide3: llamaMSlide3,
      buddyIcon: llamaMBuddyIcon,
    }
  },
  {
    id: "koala-m",
    assets: {
      slide1: koalaMSlide1,
      slide2: koalaMSlide2,
      slide3: koalaMSlide3,
      buddyIcon: koalaMBuddyIcon,
    }
  },
  {
    id: "dog-w",
    assets: {
      slide1: dogWSlide1,
      slide2: dogWSlide2,
      slide3: dogWSlide3,
      buddyIcon: dogWBuddyIcon,
    }
  },
  {
    id: "llama-w",
    assets: {
      slide1: llamaWSlide1,
      slide2: llamaWSlide2,
      slide3: llamaWSlide3,
      buddyIcon: llamaWBuddyIcon,
    }
  },
  {
    id: "fox-w",
    assets: {
      slide1: foxWSlide1,
      slide2: foxWSlide2,
      slide3: foxWSlide3,
      buddyIcon: foxWBuddyIcon,
    }
  },
  {
    id: "koala-w",
    assets: {
      slide1: koalaWSlide1,
      slide2: koalaWSlide2,
      slide3: koalaWSlide3,
      buddyIcon: koalaWBuddyIcon,
    }
  },
  {
    id: "zebra-w",
    assets: {
      slide1: zebraWSlide1,
      slide2: zebraWSlide2,
      slide3: zebraWSlide3,
      buddyIcon: zebraWBuddyIcon,
    }
  }
];

// Helper function to get breathing exercise data by buddy ID
export const getBreathingDataById = (id: string): BreathingExerciseData | undefined => {
  return BREATHING_EXERCISE_DATA.find(data => data.id === id);
};

// Default fallback data (fox-m)
export const DEFAULT_BREATHING_DATA: BreathingExerciseData = {
  id: "fox-m",
  assets: {
    slide1: foxMSlide1,
    slide2: foxMSlide2,
    slide3: foxMSlide3,
    buddyIcon: foxMBuddyIcon,
  }
};
