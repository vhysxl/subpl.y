import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchConfig } from "./configFetch";

export const auditFetch = async (page: number) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = await fetchConfig();

    const response = await fetch(`${config.apiUrl}/audit-log?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!result.data) return null;

    return result.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch users: ${error}`);
  }
};
