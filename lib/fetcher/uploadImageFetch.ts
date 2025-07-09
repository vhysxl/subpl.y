import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchConfig } from "./configFetch";

export const getCloudinarySignature = async () => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/upload`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get signature");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting signature:", error);
    throw error;
  }
};
