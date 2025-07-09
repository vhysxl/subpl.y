import { Orders } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchConfig } from "./configFetch";

export const fetchOrders = async (userId: string): Promise<Orders[]> => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/orders?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
    });

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
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${config.apiUrl}/orders/${orderId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("fetchDetailsOrder error:", error);
    throw error;
  }
};

export const fetchAllOrders = async (page: number = 1): Promise<Orders[]> => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(
      `${config.apiUrl}/orders/allorder?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch all orders (admin)");
    }

    const result = await response.json();

    if (!result.data) {
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("fetchAllOrders error:", error);
    throw error;
  }
};

export const updateOrders = async (
  status: string,
  orderId: string,
): Promise<Orders> => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${config.apiUrl}/orders/${orderId}/update`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all orders (admin)");
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("fetchAllOrders error:", error);
    throw error;
  }
};

export const getOrderDetail = async (orderId: string) => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${config.apiUrl}/orders/${orderId}/details`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order detail");
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("fetchAllOrders error:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${config.apiUrl}/orders/${orderId}/cancel`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
      },
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order detail");
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("fetchAllOrders error:", error);
    throw error;
  }
};
