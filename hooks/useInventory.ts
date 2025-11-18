import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gem, GemRarity } from '@/services/gemService';

const INVENTORY_KEY = '@geodex_inventory';
const COINS_KEY = '@geodex_coins';
const GEODES_OPENED_KEY = '@geodex_geodes_opened';

export type InventoryItem = {
  gem: Gem;
  quantity: number;
  firstObtained: string;
};

export function useInventory() {
  const [inventory, setInventory] = useState<Map<string, InventoryItem>>(new Map());
  const [coins, setCoins] = useState(1000); // Start with 1000 coins
  const [geodesOpened, setGeodesOpened] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const [storedInventory, storedCoins, storedGeodesOpened] = await Promise.all([
        AsyncStorage.getItem(INVENTORY_KEY),
        AsyncStorage.getItem(COINS_KEY),
        AsyncStorage.getItem(GEODES_OPENED_KEY),
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

    // Increment geodes opened count
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
    // Don't allow selling if we don't have the item or if it's the last one (keep at least 1 for collection)
    if (!item || item.quantity <= 1) {
      return false;
    }

    const gemValue = item.gem.value;

    // Update both inventory and coins in a single state update cycle
    setInventory((prev) => {
      const newInventory = new Map(prev);
      const updatedItem = newInventory.get(gemId);

      if (updatedItem && updatedItem.quantity > 1) {
        updatedItem.quantity -= 1;
        saveInventory(newInventory);

        // Update coins immediately after inventory update
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

  return {
    inventory,
    coins,
    geodesOpened,
    isLoading,
    addGems,
    addCoins,
    spendCoins,
    sellGem,
    getTotalValue,
    getTotalGems,
    getUniqueGems,
    getRarityCount,
  };
}
