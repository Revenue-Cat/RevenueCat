import Purchases from "react-native-purchases";

export class Transaction {
    private createDate: Date;
    private amount: number;
    private description: string;

    private constructor(createDate: Date, amount: number, description: string) {
        this.createDate = createDate;
        this.amount = amount;
        this.description = description;
    }

    static create(amount: number, description: string): Transaction {
        return new Transaction(new Date(), amount, description);
    }

    getCreateDate(): Date {
        return this.createDate;
    }

    getAmount(): number {
        return this.amount;
    }

    getDescription(): string {
        return this.description;
    }
}

export const fetchCoins = async ():Promise<number> => {
    await Purchases.invalidateVirtualCurrenciesCache();
    const virtualCurrencies = await Purchases.getVirtualCurrencies();
    const coinsBalance = virtualCurrencies.all["QUITQLY"]?.balance ?? 0;
    return (coinsBalance);
  };

  export const adjustCoinsBalance = async (coinsAmount : number) => {
    const customerInfo = await Purchases.getCustomerInfo();
    const appUserId = customerInfo.originalAppUserId;
    const API_KEY = "sk_wvGZopHNPiRznxZZiJKvIxKaOXbRE"; // Use environment variable (configure with react-native-dotenv or similar)
    const PROJECT_ID = "2ea2fbba";

    if (!API_KEY) {
      console.error("RevenueCat API key is missing");
      return false;
    }

    const res = await fetch(
      `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${appUserId}/virtual_currencies/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ adjustments: { QUITQLY: coinsAmount } }),
      }
    );
    if (!res.ok) throw new Error("Coins debit failed");
  }