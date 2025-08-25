export interface Scene {
  id: string;
  name: string;
  price: number;
  coin: number;
  owned: boolean;
  background: any; // Image source
  parallaxSlices?: {
    slice1: any;
    slice2: any;
    slice3: any;
    slice4: any;
  };
  backgroundColor: string;
}

export const SCENES_DATA: Scene[] = [
  {
    id: "bg1",
    name: "Default",
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
    name: "Sunset", 
    price: 100, 
    coin: 100,
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
    name: "Ocean", 
    price: 100, 
    coin: 100,
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
    name: "Forest", 
    price: 150, 
    coin: 150,
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
    name: "Purple", 
    price: 200, 
    coin: 200,
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
    name: "Dark", 
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
    name: "Cherry Blossom", 
    price: 175, 
    coin: 175,
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
];

// Helper function to get translated scene data
export const getTranslatedSceneData = (t: (key: string) => string): Scene[] => {
  return SCENES_DATA.map(scene => ({
    ...scene,
    name: t(`scenes.${scene.id}.name`)
  }));
};
