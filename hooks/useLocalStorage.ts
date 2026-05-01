import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isReady, setReady] = useState(false);

  const refresh = useCallback(async () => {
    return AsyncStorage.getItem(key)
      .then((stored) => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as T;
            setValue(parsed);
            return parsed;
          } catch {
            setValue(initialValue);
            return initialValue;
          }
        }
        setValue(initialValue);
        return initialValue;
      })
      .finally(() => {
        setReady(true);
      });
  }, [key]);

  useEffect(() => {
    let mounted = true;

    refresh().finally(() => {
      if (!mounted) {
        return;
      }
    });

    return () => {
      mounted = false;
    };
  }, [refresh]);

  const setStoredValue = useCallback(
    async (nextValue: T) => {
      setValue(nextValue);
      await AsyncStorage.setItem(key, JSON.stringify(nextValue));
    },
    [key]
  );

  return [value, setStoredValue, isReady, refresh] as const;
}
