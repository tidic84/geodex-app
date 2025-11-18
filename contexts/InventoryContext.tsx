import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gem, GemRarity } from '@/services/gemService';

const INVENTORY_KEY = '@geodex_inventory';
const COINS_KEY = '@geodex_coins';
const GEODES_OPENED_KEY = '@geodex_geodes_opened';
const LAST_COLLECTION_KEY = '@geodex_last_collection';

export type InventoryItem = {
  gem: Gem;
  quantity: number;
  firstObtained: string;
};

type InventoryContextType = {
  inventory: Map<string, InventoryItem>;
  coins: number;
  geodesOpened: number;
  lastCollectionTime: number;
  isLoading: boolean;
  addGems: (gems: Gem[]) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  sellGem: (gemId: string) => boolean;
  getTotalValue: () => number;
  getTotalGems: () => number;
  getUniqueGems: () => number;
  getRarityCount: () => { [key in GemRarity]: number };
  getPassiveIncomeRate: () => number;
  getAccumulatedIncome: () => number;
  collectIncome: () => number;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<Map<string, InventoryItem>>(new Map());
  const [coins, setCoins] = useState(1000);
  const [geodesOpened, setGeodesOpened] = useState(0);
  const [lastCollectionTime, setLastCollectionTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const [storedInventory, storedCoins, storedGeodesOpened, storedLastCollection] = await Promise.all([
        AsyncStorage.getItem(INVENTORY_KEY),
        AsyncStorage.getItem(COINS_KEY),
        AsyncStorage.getItem(GEODES_OPENED_KEY),
        AsyncStorage.getItem(LAST_COLLECTION_KEY),
      ]);

      if (storedInventory) {
        const parsedInventory: [string, InventoryItem][] = JSON.parse(storedInventory);
        setInventory(new Map(parsedInventory));
      }

      if (storedCoins) {
        setCoins(parseInt(storedCoins, 10));
      }

      if (storedGeodesOpened) {
        setGeodesOpened(parseInt(storedGeodesOpened, 10));
      }

      if (storedLastCollection) {
        setLastCollectionTime(parseInt(storedLastCollection, 10));
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInventory = async (newInventory: Map<string, InventoryItem>) => {
    try {
      await AsyncStorage.setItem(
        INVENTORY_KEY,
        JSON.stringify(Array.from(newInventory.entries()))
      );
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const saveCoins = async (newCoins: number) => {
    try {
      await AsyncStorage.setItem(COINS_KEY, newCoins.toString());
    } catch (error) {
      console.error('Error saving coins:', error);
    }
  };

  const saveGeodesOpened = async (count: number) => {
    try {
      await AsyncStorage.setItem(GEODES_OPENED_KEY, count.toString());
    } catch (error) {
      console.error('Error saving geodes opened:', error);
    }
  };

  const incrementGeodesOpened = () => {
    setGeodesOpened((prev) => {
      const newCount = prev + 1;
      saveGeodesOpened(newCount);
      return newCount;
    });
  };

  const addGems = (gems: Gem[]) => {
    setInventory((prev) => {
      const newInventory = new Map(prev);
      const now = new Date().toISOString();

      gems.forEach((gem) => {
        const existing = newInventory.get(gem.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          newInventory.set(gem.id, {
            gem,
            quantity: 1,
            firstObtained: now,
          });
        }
      });

      saveInventory(newInventory);
      return newInventory;
    });

    incrementGeodesOpened();
  };

  const addCoins = (amount: number) => {
    setCoins((prev) => {
      const newCoins = prev + amount;
      saveCoins(newCoins);
      return newCoins;
    });
  };

  const spendCoins = (amount: number): boolean => {
    if (coins >= amount) {
      setCoins((prev) => {
        const newCoins = prev - amount;
        saveCoins(newCoins);
        return newCoins;
      });
      return true;
    }
    return false;
  };

  const sellGem = (gemId: string): boolean => {
    const item = inventory.get(gemId);
    if (!item || item.quantity <= 1) {
      return false;
    }

    const gemValue = item.gem.value;

    setInventory((prev) => {
      const newInventory = new Map(prev);
      const updatedItem = newInventory.get(gemId);

      if (updatedItem && updatedItem.quantity > 1) {
        updatedItem.quantity -= 1;
        saveInventory(newInventory);

        setCoins((prevCoins) => {
          const newCoins = prevCoins + gemValue;
          saveCoins(newCoins);
          return newCoins;
        });
      }

      return newInventory;
    });

    return true;
  };

  const getTotalValue = (): number => {
    let total = 0;
    inventory.forEach((item) => {
      total += item.gem.value * item.quantity;
    });
    return total;
  };

  const getTotalGems = (): number => {
    let total = 0;
    inventory.forEach((item) => {
      total += item.quantity;
    });
    return total;
  };

  const getUniqueGems = (): number => {
    return inventory.size;
  };

  const getRarityCount = (): { [key in GemRarity]: number } => {
    const counts: { [key in GemRarity]: number } = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    inventory.forEach((item) => {
      counts[item.gem.rarity] += item.quantity;
    });

    return counts;
  };

  const saveLastCollectionTime = async (time: number) => {
    try {
      await AsyncStorage.setItem(LAST_COLLECTION_KEY, time.toString());
    } catch (error) {
      console.error('Error saving last collection time:', error);
    }
  };

  // Calculate passive income rate per hour based on displayed gems
  // Each gem generates income = gem.value * 0.1 per hour (10% of its value)
  const getPassiveIncomeRate = (): number => {
    let totalRate = 0;
    inventory.forEach((item) => {
      // Income per gem = value * 0.1 * quantity
      totalRate += Math.floor(item.gem.value * 0.1) * item.quantity;
    });
    return totalRate;
  };

  // Calculate accumulated income since last collection
  const getAccumulatedIncome = (): number => {
    const now = Date.now();
    const hoursElapsed = (now - lastCollectionTime) / (1000 * 60 * 60);
    const rate = getPassiveIncomeRate();
    return Math.floor(rate * hoursElapsed);
  };

  // Collect accumulated income and reset timer
  const collectIncome = (): number => {
    const income = getAccumulatedIncome();
    if (income > 0) {
      addCoins(income);
      const now = Date.now();
      setLastCollectionTime(now);
      saveLastCollectionTime(now);
    }
    return income;
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        coins,
        geodesOpened,
        lastCollectionTime,
        isLoading,
        addGems,
        addCoins,
        spendCoins,
        sellGem,
        getTotalValue,
        getTotalGems,
        getUniqueGems,
        getRarityCount,
        getPassiveIncomeRate,
        getAccumulatedIncome,
        collectIncome,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
