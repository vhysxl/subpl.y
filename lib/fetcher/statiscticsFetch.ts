import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchConfig } from "./configFetch";

export const fetchDashboard = async () => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/statistics/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("fetchProducts error:", error);
    throw error;
  }
};

export const monthlyReport = async (year: number, month: number) => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(
      `${config.apiUrl}/statistics/monthlyReport?year=${year}&month=${month}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("fetchProducts error:", error);
    throw error;
  }
};
