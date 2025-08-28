export interface SavingsData {
  itemsAvoided: number;
  moneySaved: number;
  smokeFreeDays: number;
  itemsPerUnit: number;
  pricePerItem: number;
}

export const calculateSavings = (
  smokeType: string,
  dailyAmount: string,
  packPrice: string,
  packPriceCurrency: string,
  daysSmokeFree: number = 30
): SavingsData => {
  const price = Number(packPrice) || 0;
  
  // Define items per unit for each smoke type
  const itemsPerUnitMap: Record<string, number> = {
    'cigarettes': 20,
    'roll-your-own': 20,
    'tobacco-heater': 20,
    'vaping': 1 // 1 bottle/cartridge
  };
  
  const itemsPerUnit = itemsPerUnitMap[smokeType] || 20;
  const pricePerItem = price / itemsPerUnit;
  
  // Calculate daily amount based on smoke type
  let dailyItems = 0;
  
  if (smokeType === 'vaping') {
    // For vaping, use the usage level to estimate daily ml
    const vapingUsageMap: Record<string, number> = {
      'light': 1,
      'moderate': 2,
      'heavy': 4
    };
    dailyItems = vapingUsageMap[dailyAmount] || 2;
  } else {
    // For other types, parse the range and use average
    const rangeMap: Record<string, number> = {
      '1-5': 3,
      '6-10': 7.5,
      '11-20': 15.5,
      '21+': 25
    };
    dailyItems = rangeMap[dailyAmount] || 7.5;
  }
  
  const itemsAvoided = Math.round(dailyItems * daysSmokeFree);
  const moneySaved = Math.round(itemsAvoided * pricePerItem * 100) / 100;
  
  return {
    itemsAvoided,
    moneySaved,
    smokeFreeDays: daysSmokeFree,
    itemsPerUnit,
    pricePerItem
  };
};

export const getItemLabel = (smokeType: string, count: number): string => {
  const itemLabels: Record<string, string> = {
    'cigarettes': count === 1 ? 'cigarette' : 'cigarettes',
    'roll-your-own': count === 1 ? 'rolled cigarette' : 'rolled cigarettes',
    'tobacco-heater': count === 1 ? 'stick' : 'sticks',
    'vaping': count === 1 ? 'ml' : 'ml'
  };
  
  return itemLabels[smokeType] || 'items';
};

export const getAvoidedLabel = (smokeType: string): string => {
  const avoidedLabels: Record<string, string> = {
    'cigarettes': 'Cigs avoided',
    'roll-your-own': 'Rolls avoided',
    'tobacco-heater': 'Sticks avoided',
    'vaping': 'Ml avoided'
  };
  
  return avoidedLabels[smokeType] || 'Items avoided';
};
