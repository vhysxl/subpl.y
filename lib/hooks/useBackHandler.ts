import { useEffect } from "react";
import { BackHandler } from "react-native";
import { RelativePathString, useRouter } from "expo-router";

type AllowedPaths =
  | "/"
  | "/admin/users"
  | "/(tabs)/games"
  | "/login"
  | `/game/${string}`;

export function useBackHandler(path: AllowedPaths) {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      router.replace(path);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [path, router]);
}
