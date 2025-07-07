import { useFocusEffect, useRouter } from "expo-router";
import { useAuthStore } from "../stores/useAuthStore";
import { useCallback } from "react";

export const useGuestGuard = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        router.push("/");
      }
    }, [user]),
  );
  return;
};
