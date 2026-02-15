import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PANDAS_KEY = '@pandafit_pandas';

export function usePandas() {
  const [ownedPandas, setOwnedPandas] = useState<string[]>(['classic']);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PANDAS_KEY).then((val) => {
      if (val !== null) setOwnedPandas(JSON.parse(val));
      setLoaded(true);
    });
  }, []);

  const addPanda = useCallback(async (pandaId: string) => {
    setOwnedPandas((prev) => {
      if (prev.includes(pandaId)) return prev;
      const next = [...prev, pandaId];
      AsyncStorage.setItem(PANDAS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const hasPanda = useCallback(
    (pandaId: string) => ownedPandas.includes(pandaId),
    [ownedPandas]
  );

  return { ownedPandas, loaded, addPanda, hasPanda };
}
