import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import Header from "@/app/components/admin/AdminHeader";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import BodyText from "@/app/components/extras/BodyText";
import HeadingText from "@/app/components/extras/HeadingText";
import SystemMsg from "@/app/components/extras/SystemMsg";
import AdminButton from "@/app/components/admin/AdminButton";
import AdminEditFields from "@/app/components/admin/AdminEditFields";
import { createProduct } from "@/lib/fetcher/productFetch";
import { productSchema } from "@/lib/validation/validation";
import { validateWithZod } from "@/lib/common/validator";
import { useAutoDismissMessage } from "@/lib/hooks/useDismissMessage";
import { fetchGames } from "@/lib/fetcher/gamesFetch";
import FailedMsg from "@/app/components/extras/FailedMsg";
import { Games } from "@/type";

enum ProductType {
  TOPUP = "topup",
  VOUCHER = "voucher",
}

const AddProducts = () => {
  const router = useRouter();
  const { isSuperAdmin, isAdmin } = useAuthStore();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uniqueGames, setUniqueGames] = useState<Games[]>([]);

  //form
  const [gameId, setGameId] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [type, setType] = useState<ProductType>(ProductType.TOPUP);

  useAutoDismissMessage(validationError, setValidationError, 5000);
  const availableTypes = Object.values(ProductType);

  useEffect(() => {
    const getGames = async () => {
      try {
        const games = await fetchGames();
        setUniqueGames(games);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch games");
      }
    };
    getGames();
  }, []);

  useEffect(() => {
    if (!isSuperAdmin && !isAdmin) {
      router.back();
    }
  }, [isSuperAdmin, isAdmin]);

  const handleAddProduct = async () => {
    setValidationError(null);
    setError(null);
    setSuccessMsg(null);

    const productData = {
      code: code.trim(),
      value: Number(value),
      price: Number(price),
      gameId: gameId.trim(),
      type,
      status: "available",
    };

    const isValid = validateWithZod(
      productSchema,
      productData,
      setValidationError,
    );

    console.log(isValid);

    if (!isValid) {
      return;
    }

    try {
      setSaving(true);
      await createProduct(productData);
      setSuccessMsg("Product added successfully!");
      setCode("");
      setValue("");
      setPrice("");
      setGameId("");
      setType(ProductType.TOPUP);
    } catch (error: any) {
      setError(error.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setCode("");
    setValue("");
    setPrice("");
    setGameId("");
    setType(ProductType.TOPUP);
    setValidationError(null);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <View className="flex-1 bg-background">
      <Header Heading="Product Management" Body="Add your products here" />

      <ScrollView className="flex-1 px-4 py-6">
        <SystemMsg message={successMsg || ""} type="success" />
        <SystemMsg message={error || ""} type="error" />
        <SystemMsg message={validationError || ""} type="error" />

        <View className="bg-white p-4 rounded-xl mb-6 border border-gray-100">
          <HeadingText className="text-lg mb-4">
            Product Information
          </HeadingText>

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
            title="Code"
            value={code}
            onChangeText={setCode}
            placeholder="Enter product code"
          />

          <AdminEditFields
            title="Value"
            value={value}
            onChangeText={setValue}
            placeholder="Enter value"
            keyboardType="numeric"
          />

          <AdminEditFields
            title="Price"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
          />

          <View className="mb-4">
            <BodyText className="text-gray-700 mb-3 font-medium">Game</BodyText>
            <View className="bg-gray-50 rounded-lg border border-gray-200">
              {uniqueGames ? (
                <Picker
                  style={{ color: "#1F2937" }}
                  selectedValue={gameId}
                  onValueChange={(value) => setGameId(value)}>
                  <Picker.Item label="Select a game" value="" />
                  {uniqueGames.map((game) => (
                    <Picker.Item
                      key={game.gameId}
                      label={game.name}
                      value={game.gameId}
                    />
                  ))}
                </Picker>
              ) : (
                <FailedMsg
                  onPress={() => fetchGames()}
                  error="failed to load games"
                />
              )}
            </View>
          </View>
        </View>

        <View className="flex-row space-x-3 mb-6 gap-2">
          <AdminButton
            title="Reset"
            onPress={resetForm}
            type="secondary"
            disabled={saving}
            fullWidth={false}
          />
          <AdminButton
            title={saving ? "Adding..." : "Add Product"}
            onPress={handleAddProduct}
            type="normal"
            disabled={saving}
            loading={saving}
            fullWidth={false}
          />
        </View>

        <View className="mb-10">
          <AdminButton
            title="Back to Products"
            onPress={() => router.back()}
            type="secondary"
            fullWidth
            disabled={saving}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddProducts;
