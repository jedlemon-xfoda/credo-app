import { useCallback, useEffect, useState } from "react";
import { defaultProfile, loadUserMassProfile, saveUserMassProfile } from "../services/journeyState";
import type { UserMassProfile } from "../types";

export function useUserMassProfile() {
  const [profile, setProfile] = useState<UserMassProfile>(defaultProfile);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const loaded = await loadUserMassProfile();
    setProfile((current) => (JSON.stringify(current) === JSON.stringify(loaded) ? current : loaded));
    setReady((current) => current || true);
    return loaded;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateProfile = useCallback(async (next: UserMassProfile) => {
    setProfile(next);
    await saveUserMassProfile(next);
  }, []);

  return { profile, ready, refresh, updateProfile };
}
