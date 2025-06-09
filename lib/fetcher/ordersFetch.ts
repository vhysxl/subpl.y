import { Orders } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchOrders = async (
  userId: string,
  status: string,
): Promise<Orders[]> => {
  try {
    const res = await fetch("https://vhysxl.github.io/subpl.y/config.json");
    const config = await res.json();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(
      `${config.apiUrl}/orders?userId=${userId}&status=${status}`,
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
    throw error;
  }
};

export const fetchDetailsOrder = async (orderId: string): Promise<Orders> => {
  try {
    const res = await fetch("https://vhysxl.github.io/subpl.y/config.json");
    const config = await res.json();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${config.apiUrl}/orders/${orderId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }

    const result = await response.json();
    return result.data; // atau sesuaikan berdasarkan struktur response backend kamu
  } catch (error) {
    console.error("fetchDetailsOrder error:", error);
    throw error;
  }
};

export const fetchAllOrders = async (page: number = 1): Promise<Orders[]> => {
  try {
    const res = await fetch("https://vhysxl.github.io/subpl.y/config.json");
    const config = await res.json();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(
      `${config.apiUrl}/orders/allorder?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch all orders (admin)");
    }

    const result = await response.json();

    console.log(result);

    if (!result.data) {
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("fetchAllOrders error:", error);
    throw error;
  }
};
