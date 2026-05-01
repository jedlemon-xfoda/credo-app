import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { storageKeys } from "../constants/storage";

export default function RootGate() {
  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(storageKeys.userMassProfile)
      .then((profile) => {
        if (!mounted) {
          return;
        }

        if (profile) {
          router.replace("/(tabs)/home");
          return;
        }

        router.replace("/welcome");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
