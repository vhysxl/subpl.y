import { Products } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base configuration fetcher
const getConfig = async () => {
  const res = await fetch("https://vhysxl.github.io/subpl.y/config.json");
  return await res.json();
};

export const fetchProducts = async (): Promise<Products[] | null> => {
  try {
    const config = await getConfig();
    const response = await fetch(`${config.apiUrl}/products`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();

    if (!result.data) {
      return [];
    }

    return result.data.products;
  } catch (error) {
    console.error("fetchProducts error:", error);
    throw error;
  }
};

export const createProduct = async (
  productData: Partial<Products>,
): Promise<Products> => {
  try {
    const config = await getConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("createProduct error:", error);
    throw error;
  }
};

export const updateProduct = async (
  productId: string,
  updateData: Partial<Products>,
): Promise<Products> => {
  try {
    const config = await getConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("updateProduct error:", error);
    throw error;
  }
};

export const deleteProduct = async (
  productId: string,
): Promise<{ message: string }> => {
  try {
    const config = await getConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("deleteProduct error:", error);
    throw error;
  }
};
