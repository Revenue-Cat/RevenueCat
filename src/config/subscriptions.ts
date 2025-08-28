export type PlanId = "year" | "quarter" | "month";

export type Plan = {
  id: PlanId;
  label: string; // e.g. "12 Month"
  cadenceNote: string; // e.g. "Payment once a year"
  price: number; // current price
  currency: "USD" | "EUR" | "GBP" | string;
  oldPrice?: number; // crossed-out price
  discountTag?: string; // e.g. "Save 80%"
  featured?: boolean; // emphasized card
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

// App Store links (replace with your real IDs/links)
export const APP_STORE_REVIEW_URL =
  "itms-apps://apps.apple.com/app/id0000000000?action=write-review";
export const APP_SHARE_URL = "https://apps.apple.com/app/id0000000000";
