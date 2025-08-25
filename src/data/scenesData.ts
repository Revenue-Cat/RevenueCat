export interface Scene {
  id: string;
  name: string;
  price: number;
  coin: number;
  owned: boolean;
  background: any; // Image source
}

export const SCENES_DATA: Scene[] = [
  { 
    id: "default", 
    name: "Default", 
    price: 0, 
    coin: 0,
    owned: true,
    background: require("../assets/backgrounds/BG7.png")
  },
  { 
    id: "sunset", 
    name: "Sunset", 
    price: 100, 
    coin: 0,
    owned: true,
    background: require("../assets/backgrounds/BG2.png")
  },
  { 
    id: "ocean", 
    name: "Ocean", 
    price: 100, 
    coin: 0,
    owned: true,
    background: require("../assets/backgrounds/BG3.png")
  },
  { 
    id: "forest", 
    name: "Forest", 
    price: 150, 
    coin: 150,
    owned: false,
    background: require("../assets/backgrounds/BG4.png")
  },
  { 
    id: "purple", 
    name: "Purple", 
    price: 200, 
    coin: 200,
    owned: false,
    background: require("../assets/backgrounds/BG5.png")
  },
  { 
    id: "dark", 
    name: "Dark", 
    price: 250, 
    coin: 250,
    owned: false,
    background: require("../assets/backgrounds/BG6.png")
  },
  { 
    id: "cherry-blossom", 
    name: "Cherry Blossom", 
    price: 175, 
    coin: 175,
    owned: false,
    background: require("../assets/backgrounds/BG1.png")
  },
];
