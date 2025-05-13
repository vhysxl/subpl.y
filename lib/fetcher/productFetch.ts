import { Products } from "@/type";

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products`);
    const result = await response.json();

    if (!result.data) {
      return null;
    }

    const productsData: Products[] = result.data.products;

    return productsData;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch products, ${error}`);
  }
};
