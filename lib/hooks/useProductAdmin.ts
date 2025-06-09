import { useState } from "react";
import { Products } from "@/type";
import { uploadImageToCloudinary } from "../fetcher/uploadFetch";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../fetcher/productFetch";

uploadImageToCloudinary;
export const useProductAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleCreateProduct = async (productData: Partial<Products>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createProduct(productData);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create product";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const handleUpdateProduct = async (
    id: string,
    updateData: Partial<Products>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateProduct(id, updateData);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete product";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const handleUploadImage = async (imageUri: string) => {
    setUploadingImage(true);
    try {
      const imageUrl = await uploadImageToCloudinary(imageUri);
      setUploadingImage(false);
      return { success: true, imageUrl };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      setUploadingImage(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    loading,
    error,
    uploadingImage,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    uploadImage: handleUploadImage,
  };
};
