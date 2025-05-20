import { Orders } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchOrders = async (
  userId: string,
  status: string,
): Promise<Orders[]> => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/orders?userId=${userId}&status=${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const result = await response.json();

    if (!result.data) {
      return [];
    }

    return result.data.orders;
  } catch (error) {
    console.error("fetchOrders error:", error);
    throw error; // dilempar ke catch di pemanggil (OrdersPending)
  }
};

export const fetchDetailsOrder = async () => {};
