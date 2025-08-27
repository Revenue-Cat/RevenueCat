// Keep static requires (RN bundler needs them)
export const buddyAssets = {
  alpaca: {
    m: require("./alpaca-m.json"),
    w: require("./alpaca-w.json"),
  },
  dog: {
    m: require("./dog-m.json"),
    w: require("./dog-w.json"),
  },
  fox: {
    m: require("./fox-m.json"),
    w: require("./fox-w.json"),
  },
  koala: {
    m: require("./koala-m.json"),
    w: require("./koala-w.json"),
  },
  zebra: {
    m: require("./zebra-m.json"),
    w: require("./zebra-w.json"),
  },
} as const;

export type BuddyKey = keyof typeof buddyAssets; // 'alpaca' | 'dog' | ...
export type SexKey = keyof (typeof buddyAssets)["alpaca"]; // 'm' | 'w'
