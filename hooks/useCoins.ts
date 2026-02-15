import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COINS_KEY = '@pandafit_coins';

export function useCoins() {
  const [coins, setCoins] = useState(200);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(COINS_KEY).then((val) => {
      if (val !== null) {
        setCoins(parseInt(val, 10));
      } else {
        AsyncStorage.setItem(COINS_KEY, '200');
      }
      setLoaded(true);
    });
  }, []);

  const addCoins = useCallback(async (amount: number) => {
    setCoins((prev) => {
      const next = prev + amount;
      AsyncStorage.setItem(COINS_KEY, String(next));
      return next;
    });
  }, []);

  const spendCoins = useCallback(async (amount: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setCoins((prev) => {
        if (prev < amount) {
          resolve(false);
          return prev;
        }
        const next = prev - amount;
        AsyncStorage.setItem(COINS_KEY, String(next));
        resolve(true);
        return next;
      });
    });
  }, []);

  return { coins, loaded, addCoins, spendCoins };
}
