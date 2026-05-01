import type { Reflection } from "../types";
import { storageKeys } from "../constants/storage";
import { useLocalStorage } from "./useLocalStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useReflections() {
  const [reflections, setReflections, isReady, refresh] = useLocalStorage<Reflection[]>(storageKeys.reflections, []);

  async function addReflection(reflection: Reflection) {
    const stored = await AsyncStorage.getItem(storageKeys.reflections);
    let existing: Reflection[] = [];

    if (stored) {
      try {
        existing = JSON.parse(stored) as Reflection[];
      } catch {
        existing = [];
      }
    }

    await setReflections([reflection, ...existing]);
  }

  async function clearReflections() {
    await setReflections([]);
  }

  return {
    reflections,
    addReflection,
    clearReflections,
    isReady,
    refresh
  };
}
