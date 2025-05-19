import { useFocusEffect, useRouter } from "expo-router";
import { useAuthStore } from "../stores/useAuthStore";
import { useCallback } from "react";

export const useAuthGuard = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        router.push("/login");
      }
    }, [user]), //redirect langsung malah crash jadi harus pake ini
  );

  return;
};
