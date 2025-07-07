import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/admin/Header";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import BodyText from "@/app/components/extras/BodyText";
import HeadingText from "@/app/components/extras/HeadingText";
import SystemMsg from "@/app/components/extras/SystemMsg";
import AdminButton from "@/app/components/admin/AdminButton";
import AdminEditFields from "@/app/components/admin/AdminEditFields";
import { validateWithZod } from "@/lib/common/validator";
import { useAutoDismissMessage } from "@/lib/hooks/useDismissMessage";
import { gameSchema } from "@/lib/validation/validation";
import { createGames } from "@/lib/fetcher/gamesFetch";
import ImageUploader from "@/app/components/admin/ImageUploader";

const addGames = () => {
  const router = useRouter();
  const { isSuperAdmin, isAdmin } = useAuthStore();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // form
  const [name, setName] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isPopular, setIsPopular] = useState<boolean>(false);

  useAutoDismissMessage(validationError, setValidationError, 5000);

  useEffect(() => {
    if (!isSuperAdmin && !isAdmin) {
      router.back();
    }
  }, [isSuperAdmin, isAdmin]);

  const handleAddGame = async () => {
    setValidationError(null);
    setError(null);
    setSuccessMsg(null);

    const gameData = {
      name: name.trim(),
      currency: currency.trim(),
      imageUrl: imageUrl.trim(),
      isPopular,
    };

    const isValid = validateWithZod(
      gameSchema,
      {
        name,
        currency,
        imageUrl,
        isPopular,
      },
      setValidationError,
    );

    if (!isValid) {
      return;
    }

    try {
      setSaving(true);
      await createGames(gameData);
      setSuccessMsg("Game added successfully!");
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Failed to add game");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCurrency("");
    setImageUrl("");
    setIsPopular(false);
    setValidationError(null);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <View className="flex-1 bg-background">
      <Header Heading="Games Management" Body="Add new game here" />

      <ScrollView className="flex-1 px-4 py-6">
        <SystemMsg message={successMsg || ""} type="success" />
        <SystemMsg message={error || ""} type="error" />
        <SystemMsg message={validationError || ""} type="error" />

        <View className="bg-white p-4 rounded-xl mb-6 border border-gray-100">
          <HeadingText className="text-lg mb-4">Game Information</HeadingText>

          <AdminEditFields
            title="Game Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter game name (e.g., Mobile Legends)"
          />

          <AdminEditFields
            title="Currency"
            value={currency}
            onChangeText={setCurrency}
            placeholder="Enter currency (e.g., Diamond, UC, Voucher)"
          />

          <ImageUploader
            currentImageUrl={""}
            onImageUploaded={(url) => setImageUrl(url)}
            placeholder="Upload Game Image"
          />

          <View className="mb-4">
            <BodyText className="text-gray-700 mb-3 font-medium">
              Popular Status
            </BodyText>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setIsPopular(false)}
                className={`flex-row items-center p-3 rounded-lg border flex-1 ${
                  !isPopular
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}>
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    !isPopular ? "bg-primary border-primary" : "border-gray-300"
                  }`}>
                  {!isPopular && (
                    <View className="w-full h-full rounded-full bg-white m-0.5" />
                  )}
                </View>
                <BodyText
                  className={`${
                    !isPopular ? "text-blue-700" : "text-gray-700"
                  }`}>
                  Regular
                </BodyText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsPopular(true)}
                className={`flex-row items-center p-3 rounded-lg border flex-1 ${
                  isPopular
                    ? "bg-orange-50 border-orange-300"
                    : "bg-gray-50 border-gray-200"
                }`}>
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    isPopular
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300"
                  }`}>
                  {isPopular && (
                    <View className="w-full h-full rounded-full bg-white m-0.5" />
                  )}
                </View>
                <BodyText
                  className={`${
                    isPopular ? "text-orange-700" : "text-gray-700"
                  }`}>
                  🔥 Popular
                </BodyText>
              </TouchableOpacity>
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
            title={saving ? "Adding..." : "Add Game"}
            onPress={handleAddGame}
            type="normal"
            disabled={saving}
            loading={saving}
            fullWidth={false}
          />
        </View>

        <View className="mb-10">
          <AdminButton
            title="Back to Games"
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

export default addGames;
