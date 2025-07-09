import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useProductStore } from "@/lib/stores/useProductStores";
import { deleteProduct, updateProduct } from "@/lib/fetcher/productFetch";
import { getUniqueGames } from "@/lib/common/getUnique";
import { productSchema } from "@/lib/validation/validation";
import { validateWithZod } from "@/lib/common/validator";
import SystemMsg from "@/app/components/ui/SystemMsg";
import HeadingText from "@/app/components/ui/HeadingText";
import BodyText from "@/app/components/ui/BodyText";
import AdminButton from "@/app/components/admin/AdminButton";
import AdminBack from "@/app/components/admin/AdminBack";
import AdminEditFields from "@/app/components/admin/AdminEditFields";
import { useAutoDismissMessage } from "@/lib/hooks/useDismissMessage";

export enum ProductType {
  TOPUP = "topup",
  VOUCHER = "voucher",
}

const EditProductPage = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { isSuperAdmin, isAdmin } = useAuthStore();
  const { adminProducts } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  //form
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [type, setType] = useState<ProductType>(ProductType.TOPUP);

  useAutoDismissMessage(validationError, setValidationError, 5000);
  const availableTypes = Object.values(ProductType);
  const product = adminProducts.find((x) => x.productId === productId);
  const uniqueGames = getUniqueGames(adminProducts);

  useEffect(() => {
    if (!isSuperAdmin && !isAdmin) {
      router.back();
    }
  }, [isSuperAdmin, isAdmin]);

  useEffect(() => {
    setLoading(true);
    if (product) {
      setValue(String(product.value));
      setPrice(String(product.price));
      setGameId(product.gameId);
      setType(product.type as ProductType);
      setCode(product.code || "");
      setStatus(product.status || "available");
    }
    setLoading(false);
  }, [product]);

  const handleSave = async () => {
    setValidationError(null);
    setError(null);
    setSuccessMsg(null);

    const updateData = {
      code: code.trim(),
      value,
      price,
      gameId: gameId.trim(),
      type,
      status: status.trim(),
    };

    const isValid = validateWithZod(
      productSchema,
      updateData,
      setValidationError,
    );
    if (!isValid) return;

    try {
      setSaving(true);
      await updateProduct(productId, {
        ...updateData,
        value: Number(value),
        price: Number(price),
      });
      setSuccessMsg("Product updated successfully!");
    } catch (error: any) {
      setError(error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              await deleteProduct(productId);
              router.back();
            } catch (err: any) {
              setError(err.message);
            } finally {
              setSaving(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <BodyText>Loading product data...</BodyText>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-4">
        <SystemMsg message="Product not found" type="error" />
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-500 px-4 py-2 rounded-lg mt-4">
          <BodyText className="text-white">Go Back</BodyText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <AdminBack heading="Edit Product" />

      <ScrollView className="flex-1 px-4 py-6">
        <SystemMsg message={successMsg || ""} type="success" />
        <SystemMsg message={error || ""} type="error" />
        <SystemMsg message={validationError || ""} type="error" />

        {/* Read-only Product Information */}
        <View className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
          <HeadingText className="text-lg mb-4 text-gray-700">
            Product Information
          </HeadingText>

          <View className="space-y-3">
            <View>
              <BodyText className="text-gray-500 text-sm">Product ID</BodyText>
              <BodyText className="font-medium text-gray-700">
                {product.productId}
              </BodyText>
            </View>

            {product.gameName && (
              <View>
                <BodyText className="text-gray-500 text-sm">Game Name</BodyText>
                <BodyText className="font-medium text-gray-700">
                  {product.gameName}
                </BodyText>
              </View>
            )}

            {product.currency && (
              <View>
                <BodyText className="text-gray-500 text-sm">Currency</BodyText>
                <BodyText className="font-medium text-gray-700">
                  {product.currency}
                </BodyText>
              </View>
            )}
          </View>
        </View>

        <View className="bg-white p-4 rounded-xl mb-6 border border-gray-100">
          <HeadingText className="text-lg mb-4">Edita Information</HeadingText>
          <View className="mb-4">
            <BodyText className="text-gray-700 mb-3 font-medium">
              Product Type
            </BodyText>
            <View className="flex-row space-x-3">
              {availableTypes.map((productType) => (
                <TouchableOpacity
                  key={productType}
                  onPress={() => setType(productType)}
                  className={`flex-row items-center p-3 rounded-lg border flex-1 ${
                    type === productType
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      type === productType
                        ? "bg-primary border-primary"
                        : "border-gray-300"
                    }`}>
                    {type === productType && (
                      <View className="w-full h-full rounded-full bg-white m-0.5" />
                    )}
                  </View>
                  <BodyText
                    className={`capitalize ${
                      type === productType ? "text-blue-700" : "text-gray-700"
                    }`}>
                    {productType}
                  </BodyText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <AdminEditFields
            title="Value"
            value={value}
            onChangeText={setValue}
            placeholder="Enter value"
            keyboardType="numeric"
          />

          <AdminEditFields
            title="Code"
            value={code}
            onChangeText={setCode}
            placeholder="Enter product code"
          />

          <AdminEditFields
            title="Price"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
          />

          <View className="mb-4">
            <BodyText className="text-gray-700 mb-3 font-medium">
              Status
            </BodyText>
            <View className="flex-row space-x-3">
              {["available", "used"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatus(s)}
                  className={`px-4 py-2 rounded-lg border ${
                    status === s
                      ? "bg-green-100 border-green-400"
                      : "bg-gray-100 border-gray-300"
                  }`}>
                  <BodyText className="capitalize">{s}</BodyText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="mb-4">
            <BodyText className="text-gray-700 mb-3 font-medium">Game</BodyText>
            <View className="bg-gray-50 rounded-lg border border-gray-200">
              <Picker
                style={{ color: "#1F2937" }}
                selectedValue={gameId}
                onValueChange={(value) => setGameId(value)}>
                <Picker.Item label="Select a game" value="" />
                {uniqueGames.map((game) => (
                  <Picker.Item
                    key={game.gameId}
                    label={game.gameName}
                    value={game.gameId}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <View className="flex-row space-x-3 mb-6 gap-2">
          <AdminButton
            title="Cancel"
            onPress={() => router.back()}
            type="secondary"
            disabled={saving}
            fullWidth={false}
          />
          <AdminButton
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            type="normal"
            disabled={saving}
            loading={saving}
            fullWidth={false}
          />
        </View>

        {isSuperAdmin && (
          <View className="mb-10">
            <AdminButton
              title={saving ? "Deleting..." : "Delete Product"}
              onPress={handleDelete}
              type="danger"
              fullWidth
              disabled={saving}
              loading={saving}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default EditProductPage;
