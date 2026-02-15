import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COINS_KEY = '@pandafit_coins';

export function useCoins() {
  const [coins, setCoins] = useState(200);
  const [loaded, setLoaded] = useState(false);
  const coinsRef = useRef(200);

  useEffect(() => {
    AsyncStorage.getItem(COINS_KEY).then((val) => {
      if (val !== null) {
        const parsed = parseInt(val, 10);
        setCoins(parsed);
        coinsRef.current = parsed;
      } else {
        AsyncStorage.setItem(COINS_KEY, '200');
        coinsRef.current = 200;
      }
      setLoaded(true);
    });
  }, []);

  const addCoins = useCallback(async (amount: number) => {
    const next = coinsRef.current + amount;
    coinsRef.current = next;
    setCoins(next);
    await AsyncStorage.setItem(COINS_KEY, String(next));
  }, []);

  const spendCoins = useCallback(async (amount: number): Promise<boolean> => {
    if (coinsRef.current < amount) {
      return false;
    }
    const next = coinsRef.current - amount;
    coinsRef.current = next;
    setCoins(next);
    await AsyncStorage.setItem(COINS_KEY, String(next));
    return true;
  }, []);

  return { coins, loaded, addCoins, spendCoins };
}
