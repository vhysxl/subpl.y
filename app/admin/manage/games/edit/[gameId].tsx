import { View, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { gameSchema } from "@/lib/validation/validation";
import { validateWithZod } from "@/lib/common/validator";
import SystemMsg from "@/app/components/ui/SystemMsg";
import HeadingText from "@/app/components/ui/HeadingText";
import BodyText from "@/app/components/ui/BodyText";
import AdminButton from "@/app/components/admin/AdminButton";
import AdminBack from "@/app/components/admin/AdminBack";
import AdminEditFields from "@/app/components/admin/AdminEditFields";
import { useAutoDismissMessage } from "@/lib/hooks/useDismissMessage";
import { deleteGame, updateGame } from "@/lib/fetcher/gamesFetch";
import { Games } from "@/type";
import ImageUploader from "@/app/components/admin/ImageUploader";

const EditGamePage = () => {
  const router = useRouter();
  const { gameId, gameData } = useLocalSearchParams<{
    gameId: string;
    gameData?: string;
  }>();
  const { isSuperAdmin, isAdmin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [game, setGame] = useState<Games | null>(null);

  // form
  const [name, setName] = useState<string>("");
  const [isPopular, setIsPopular] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  useAutoDismissMessage(validationError, setValidationError, 5000);

  useEffect(() => {
    if (!isSuperAdmin && !isAdmin) {
      router.back();
    }
  }, [isSuperAdmin, isAdmin]);

  useEffect(() => {
    setLoading(true);
    if (gameData) {
      try {
        const parsedGame = JSON.parse(gameData) as Games; //parse game dari params
        setGame(parsedGame);
      } catch (error) {
        console.error("Failed to parse game data:", error);
        setError("Failed to load game data");
      }
    } else {
      setError("No game data provided");
    }
    setLoading(false);
  }, [gameData]);

  useEffect(() => {
    if (game) {
      setName(game.name);
      setIsPopular(game.isPopular);
      setCurrency(game.currency);
      setImageUrl(game.imageUrl);
    }
  }, [game]);

  const handleSave = async () => {
    setValidationError(null);
    setError(null);
    setSuccessMsg(null);

    const updateData = {
      name: name.trim(),
      isPopular,
      currency: currency.trim(),
      imageUrl: imageUrl.trim(),
    };

    const isValid = validateWithZod(gameSchema, updateData, setValidationError);
    if (!isValid) return;

    try {
      setSaving(true);
      await updateGame(updateData, gameId);
      setSuccessMsg("Game updated successfully!");

      setGame((prev) => (prev ? { ...prev, ...updateData } : null));
    } catch (error: any) {
      setError(error.message || "Failed to update game");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Game",
      "Are you sure you want to delete this game?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              await deleteGame(gameId as string);
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
        <BodyText>Loading game data...</BodyText>
      </View>
    );
  }

  if (!game) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-4">
        <SystemMsg message="Game not found or failed to load" type="error" />
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
      <AdminBack heading="Edit Game" />

      <ScrollView className="flex-1 px-4 py-6">
        <SystemMsg message={successMsg || ""} type="success" />
        <SystemMsg message={error || ""} type="error" />
        <SystemMsg message={validationError || ""} type="error" />
        <View className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
          <HeadingText className="text-lg mb-4 text-gray-700">
            Game Information
          </HeadingText>

          <View className="space-y-3">
            <View>
              <BodyText className="text-gray-500 text-sm">Game ID</BodyText>
              <BodyText className="font-medium text-gray-700">
                {game.gameId}
              </BodyText>
            </View>

            {game.imageUrl && (
              <View>
                <BodyText className="text-gray-500 text-sm mb-2">
                  Current Image
                </BodyText>
                <Image
                  source={{ uri: game.imageUrl }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        </View>

        <View className="bg-white p-4 rounded-xl mb-6 border border-gray-100">
          <HeadingText className="text-lg mb-4">Edit Information</HeadingText>

          <AdminEditFields
            title="Game Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter game name"
          />

          <AdminEditFields
            title="Currency"
            value={currency}
            onChangeText={setCurrency}
            placeholder="Enter currency (e.g., USD, Diamonds, Coins)"
          />

          <ImageUploader
            currentImageUrl={game?.imageUrl}
            onImageUploaded={(url) => setImageUrl(url)}
            placeholder="Upload Game Image"
          />

          {imageUrl && imageUrl !== game.imageUrl && (
            <View className="mb-4">
              <BodyText className="text-gray-700 mb-2 font-medium">
                New Image Preview
              </BodyText>
              <Image
                source={{ uri: imageUrl }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
                onError={() => {
                  console.log("Failed to load image preview");
                }}
              />
            </View>
          )}

          <View className="mb-4">
            <BodyText className="text-gray-700 mb-3 font-medium">
              Popular Status
            </BodyText>
            <View className="flex-row space-x-3">
              {[
                { label: "Popular", value: true },
                { label: "Not Popular", value: false },
              ].map((option) => (
                <TouchableOpacity
                  key={option.label}
                  onPress={() => setIsPopular(option.value)}
                  className={`flex-row items-center p-3 rounded-lg border flex-1 ${
                    isPopular === option.value
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      isPopular === option.value
                        ? "bg-primary border-primary"
                        : "border-gray-300"
                    }`}>
                    {isPopular === option.value && (
                      <View className="w-full h-full rounded-full bg-white m-0.5" />
                    )}
                  </View>
                  <BodyText
                    className={`${
                      isPopular === option.value
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}>
                    {option.label}
                  </BodyText>
                </TouchableOpacity>
              ))}
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
              title={saving ? "Deleting..." : "Delete Game"}
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

export default EditGamePage;
