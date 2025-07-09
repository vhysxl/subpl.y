import { Games } from "@/type";
import { fetchConfig } from "./configFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchGames = async (): Promise<Games[]> => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/games`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }

    const result = await response.json();

    if (!result.data) {
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("fetchGames error: ", error);
    throw error;
  }
};

export const createGames = async (
  gamesData: Partial<Games>,
): Promise<Games> => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${config.apiUrl}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
      body: JSON.stringify(gamesData),
    });

    if (!response.ok) {
      throw new Error("Failed to create game");
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error("No data returned from server");
    }

    return result.data;
  } catch (error) {
    console.error("createGames error:", error);
    throw error;
  }
};

export const updateGame = async (
  updateData: Partial<Games>,
  gameId: string,
): Promise<Games> => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${config.apiUrl}/games/${gameId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to patch game");
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error("No data returned from server");
    }

    return result.data;
  } catch (error) {
    console.error("patchGame error:", error);
    throw error;
  }
};

export const deleteGame = async (
  gameId: string,
): Promise<{ message: string }> => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${config.apiUrl}/games/${gameId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete game");
    }

    const result = await response.json();
    return result.message;
  } catch (error) {
    console.error("deleteGame error:", error);
    throw error;
  }
};
