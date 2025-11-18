import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gem } from '@/services/gemService';

const INVENTORY_KEY = '@geodex_inventory';
const COINS_KEY = '@geodex_coins';

export type InventoryItem = {
  gem: Gem;
  quantity: number;
  firstObtained: string;
};

export function useInventory() {
  const [inventory, setInventory] = useState<Map<string, InventoryItem>>(new Map());
  const [coins, setCoins] = useState(1000); // Start with 1000 coins
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const [storedInventory, storedCoins] = await Promise.all([
        AsyncStorage.getItem(INVENTORY_KEY),
        AsyncStorage.getItem(COINS_KEY),
      ]);

      if (storedInventory) {
        const parsedInventory: [string, InventoryItem][] = JSON.parse(storedInventory);
        setInventory(new Map(parsedInventory));
      }

      if (storedCoins) {
        setCoins(parseInt(storedCoins, 10));
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
    if (!item || item.quantity === 0) {
      return false;
    }

    setInventory((prev) => {
      const newInventory = new Map(prev);
      const updatedItem = newInventory.get(gemId);

      if (updatedItem) {
        updatedItem.quantity -= 1;
        if (updatedItem.quantity === 0) {
          newInventory.delete(gemId);
        }
        saveInventory(newInventory);
      }

      return newInventory;
    });

    addCoins(item.gem.value);
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

  return {
    inventory,
    coins,
    isLoading,
    addGems,
    addCoins,
    spendCoins,
    sellGem,
    getTotalValue,
    getTotalGems,
    getUniqueGems,
  };
}
