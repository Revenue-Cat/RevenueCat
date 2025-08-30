// Subscriptions kept for compatibility (unused for now)
export type PlanId = "year" | "quarter" | "month";
export type Plan = {
  id: PlanId;
  label: string;
  cadenceNote: string;
  price: number;
  currency: "USD" | "EUR" | "GBP" | string;
  oldPrice?: number;
  discountTag?: string;
  featured?: boolean;
};

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: "year",
    label: "12 Month",
    cadenceNote: "Payment once a year",
    price: 29.99,
    oldPrice: 149.99,
    currency: "USD",
    discountTag: "Save 80%",
    featured: true,
  },
  {
    id: "quarter",
    label: "3 Months",
    cadenceNote: "Payment once a 3 month",
    price: 7.99,
    oldPrice: 10.99,
    currency: "USD",
  },
  {
    id: "month",
    label: "1 Months",
    cadenceNote: "Payment once a month",
    price: 3.99,
    oldPrice: 5.99,
    currency: "USD",
  },
];

// ----------------- Coin Packs -----------------
export type CoinPackId = "starter" | "popular" | "best";

export type CoinPack = {
  id: CoinPackId;
  label: string;      // e.g., "Starter"
  coins: number;      // e.g., 100
  price: number;      // e.g., 0.99
  currency: "USD" | string;
  oldPrice?: number;  // e.g., 2.0
  bonusTag?: string;  // e.g., "+20% bonus included"
  featured?: boolean; // highlighted card (only this one gets border)
  caption?: string;   // small subtitle
};

export const COIN_PACKS: CoinPack[] = [
  {
    id: "starter",
    label: "Starter",
    coins: 100,
    price: 1.99,
    oldPrice: 2.0,
    currency: "USD",
    caption: "Quick start, no pressure",
  },
  {
    id: "popular",
    label: "Booster",
    coins: 300,
    price: 3.99,
    oldPrice: 5.0,
    currency: "USD",
    bonusTag: "+20% bonus included",
    featured: true, // only this one shows indigo border
    caption: "Solid value, real progress.",
  },
  {
    id: "best",
    label: "Pro",
    coins: 500,
    price: 4.99,
    oldPrice: 9.0,
    currency: "USD",
    bonusTag: "+45% bonus included",
    caption: "Go big, stay on track.",
  }
];

// App Store links (replace with your real IDs/links)
export const APP_STORE_REVIEW_URL =
  "itms-apps://apps.apple.com/app/id0000000000?action=write-review";
export const APP_SHARE_URL = "https://apps.apple.com/app/id0000000000";
