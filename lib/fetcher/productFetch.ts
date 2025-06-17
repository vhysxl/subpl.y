import { DetailedProducts, Products } from "@/type";
import { fetchConfig } from "./configFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchProducts = async (): Promise<Products[] | null> => {
  try {
    const config = await fetchConfig();
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

export const fetchAdminProducts = async (): Promise<
  DetailedProducts[] | null
> => {
  try {
    const config = await fetchConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/products/productsAdmin`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();
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
    const config = await fetchConfig();
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
    const config = await fetchConfig();
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
    const config = await fetchConfig();
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
    return result.message;
  } catch (error) {
    console.error("deleteProduct error:", error);
    throw error;
  }
};
