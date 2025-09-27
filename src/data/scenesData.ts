import Cactus from "../assets/backgrounds/placeholders/Cactus.svg";
import Forest from "../assets/backgrounds/placeholders/Forest.svg";
import Mountain from "../assets/backgrounds/placeholders/Mountain.svg";
import NightSky from "../assets/backgrounds/placeholders/NightSky.svg";
import Palm from "../assets/backgrounds/placeholders/Palm.svg";
import Park from "../assets/backgrounds/placeholders/Park.svg";
import Sunset from "../assets/backgrounds/placeholders/Sunset.svg";

export interface Scene {
  id: string;
  name: string;
  description: string;
  price?: number;
  coin?: number;
  owned?: boolean;
  background?: any; // Image source
  parallaxSlices?: {
    slice1: any;
    slice2: any;
    slice3: any;
    slice4: any;
  };
  backgroundColor?: string;
  icon?: any;
}
export const PLACEHOLDER_SCENE: Scene[] = [
  {
    id: "bg01",
    name: "Desert Oasis",
    description: "Cactus landscape with warm sands. A serene desert retreat.",
    icon: Cactus
  },
  {
    id: "bg02",
    name: "Mountain Peak",
    description: "Majestic mountains reaching the sky. A place of strength and tranquility.",
    icon: Mountain
  },
  {
    id: "bg03",
    name: "Ancient Forest",
    description: "Dense forest with towering trees. A natural sanctuary of peace.",
    icon: Forest
  },
  {
    id: "bg04",
    name: "Starlit Night",
    description: "Night sky filled with stars. A peaceful moment under the cosmos.",
    icon: NightSky
  },
  {
    id: "bg05",
    name: "Tropical Paradise",
    description: "Palm trees swaying in the breeze. Island serenity and calm.",
    icon: Palm
  },
  {
    id: "bg06",
    name: "Urban Garden",
    description: "Green park in the city. Nature's touch in urban surroundings.",
    icon: Park
  },
  {
    id: "bg07",
    name: "Golden Sunset",
    description: "Beautiful sunset painting the sky. A moment of reflection and beauty.",
    icon: Sunset
  },
]
export const SCENES_DATA: Scene[] = [
  {
    id: "bg1",
    name: "Emerald Silence",
    description: "Mountains, forest and lake in unity. A place where thoughts fade.",
    price: 0,
    coin: 0,
    owned: true,
    background: require("../assets/backgrounds/BG1.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg1/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg1/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg1/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg1/slice4.png"),
    },
    backgroundColor: 'linear-gradient(179.97deg, #1F1943 48.52%, #4E3EA9 99.97%)',
  },
  { 
    id: "bg2", 
    name: "Silent Japan", 
    description: "A pagoda among mountains. An atmosphere of harmony and balance.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG2.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg2/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg2/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg2/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg2/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180deg, #1B1B2A 75.37%, #323654 101.11%)',
  },
  { 
    id: "bg3", 
    name: "Sandy Horizon", 
    description: "Desert under the sun. Endless spaces and a road into the unknown.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG3.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg3/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg3/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg3/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg3/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180deg, #73281F 60.15%, #8A524C 103.14%)',
  },
  { 
    id: "bg4", 
    name: "Golden City", 
    description: "Skyscrapers glowing in sunset. Energy and pulse of the metropolis.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG4.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg4/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg4/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg4/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg4/slice4.png"),
    },
    backgroundColor:'linear-gradient(180.04deg, #35190B 57.2%, #6E381D 99.97%)',
  },
  { 
    id: "bg5", 
    name: "Green Awakening", 
    description: "Jungle under a bright sky. Morning freshness, new life.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG5.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg5/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg5/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg5/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg5/slice4.png"),
    },
    backgroundColor: 'linear-gradient(179.97deg, #013830 48.52%, #048774 99.97%)',
  },
  { 
    id: "bg6", 
    name: "Violet Evening", 
    description: "Palms and sea at sunset glow. A time for dreams and rest.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG6.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg6/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg6/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg6/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg6/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180.04deg, #0F041F 57.2%, #7B52BD 99.97%)',
  },
  { 
    id: "bg7", 
    name: "Misty Forest", 
    description: "Hills and trees in mist. A mysterious, silent world.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG7.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg7/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg7/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg7/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg7/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180deg, #02162F 55.17%, #4E3EA9 100%)',
  },
  { 
    id: "bg8", 
    name: "Pink Horizon", 
    description: "Mountains in soft hues. A beauty that feels like a dream.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG8.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg8/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg8/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg8/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg8/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180.04deg, #40194F 57.2%, #6E2A89 99.97%)'
  },
  { 
    id: "bg9", 
    name: "Tropical Symphony", 
    description: "Beach, waves and sun. A light melody of freedom.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG9.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg9/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg9/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg9/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg9/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180.04deg, #00878E 57.2%, #02A2AA 99.97%)',
  },
  { 
    id: "bg10", 
    name: "Halloween Night", 
    description: "Full moon over the forest. Bats and whispers of secrets.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG10.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg10/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg10/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg10/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg10/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180.04deg, #30070F 57.2%, #670D1F 99.97%)',
  },
  { 
    id: "bg11", 
    name: "Flower Valley",
    description: "Hills covered in flowers. Springtime lightness and inspiration.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG11.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg11/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg11/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg11/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg11/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180.04deg, #13334C 57.2%, #1E4D72 99.97%)',
  },
  { 
    id: "bg12", 
    name: "City & Park", 
    description: "Green paths beside the city. A meeting of nature and urban life.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG12.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg12/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg12/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg12/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg12/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180.04deg, #287561 57.2%, #359E83 99.97%)',
  },
  { 
    id: "bg13", 
    name: "Dawn Bridge", 
    description: "Path to the sun over the sea. A beginning full of hope.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG13.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg13/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg13/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg13/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg13/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180.04deg, #355070 57.2%, #4A6F9A 99.97%)',
  },
  // { 
  //   id: "bg14", 
  //   name: "Dream Sky", 
  //   description: "Balloons under shooting stars. A gentle sky fairytale.",
  //   price: 250, 
  //   coin: 250,
  //   owned: true,
  //   background: require("../assets/backgrounds/BG14.png"),
  //   parallaxSlices: {
  //     slice1: require("../assets/backgrounds/parallax/bg14/slice1.png"),
  //     slice2: require("../assets/backgrounds/parallax/bg14/slice2.png"),
  //     slice3: require("../assets/backgrounds/parallax/bg14/slice3.png"),
  //     slice4: require("../assets/backgrounds/parallax/bg14/slice4.png"),
  //   },
  //   backgroundColor: 'linear-gradient(180.04deg, #481F46 57.2%, #7C3458 99.97%)',
  // },
  { 
    id: "bg15", 
    name: "Evening City", 
    description: "Buildings in sunset light. Warmth and serene grandeur.",
    price: 250, 
    coin: 250,
    owned: true,
    background: require("../assets/backgrounds/BG15.png"),
    parallaxSlices: {
      slice1: require("../assets/backgrounds/parallax/bg15/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/bg15/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/bg15/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/bg15/slice4.png"),
    },
    backgroundColor: 'linear-gradient(180.04deg, #222356 57.2%, #3A3C9F 99.97%)',
  },
];

// Helper function to get translated scene data
export const getTranslatedSceneData = (t: (key: string) => string): Scene[] => {
  return SCENES_DATA.map(scene => ({
    ...scene,
    name: t(`scenes.${scene.id}.name`) || scene.name,
    description: t(`scenes.${scene.id}.description`) || scene.description
  }));
};

// Helper function to get translated PLACEHOLDER_SCENE data
export const getTranslatedPlaceholderSceneData = (t: (key: string) => string): Scene[] => {
  return PLACEHOLDER_SCENE.map(scene => ({
    ...scene,
    name: t(`scenes.${scene.id}.name`) || scene.name,
    description: t(`scenes.${scene.id}.description`) || scene.description
  }));
};
