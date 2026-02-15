import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PANDAS_KEY = '@pandafit_pandas';

export interface OwnedPanda {
  instanceId: string;
  typeId: string;
}

export function usePandas() {
  const [ownedPandas, setOwnedPandas] = useState<OwnedPanda[]>([
    { instanceId: 'classic_0', typeId: 'classic' },
  ]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PANDAS_KEY).then((val) => {
      if (val !== null) setOwnedPandas(JSON.parse(val));
      setLoaded(true);
    });
  }, []);

  const addPanda = useCallback(async (typeId: string) => {
    setOwnedPandas((prev) => {
      const instanceId = `${typeId}_${Date.now()}`;
      const next = [...prev, { instanceId, typeId }];
      AsyncStorage.setItem(PANDAS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const countOfType = useCallback(
    (typeId: string) => ownedPandas.filter((p) => p.typeId === typeId).length,
    [ownedPandas]
  );

  return { ownedPandas, loaded, addPanda, countOfType };
}
