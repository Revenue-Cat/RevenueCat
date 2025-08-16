// Keep static requires (RN bundler needs them)
export const buddyAssets = {
  alpaca: {
    m: require("./Alpaca-m.png"),
    w: require("./Alpaca-w.png"),
  },
  dog: {
    m: require("./Dog-m.png"),
    w: require("./Dog-w.png"),
  },
  fox: {
    m: require("./Fox-m.png"),
    w: require("./Fox-w.png"),
  },
  koala: {
    m: require("./Koala-m.png"),
    w: require("./Koala-w.png"),
  },
  zebra: {
    m: require("./Zebra-m.png"),
    w: require("./Zebra-w.png"),
  },
} as const;

export type BuddyKey = keyof typeof buddyAssets; // 'alpaca' | 'dog' | ...
export type SexKey = keyof (typeof buddyAssets)["alpaca"]; // 'm' | 'w'
