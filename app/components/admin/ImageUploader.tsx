import React, { useState } from "react";
import { View, Alert, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import BodyText from "@/app/components/extras/BodyText";
import { getCloudinarySignature } from "@/lib/fetcher/uploadImageFetch";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  placeholder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  placeholder = "Upload Image",
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null,
  );

  const uploadToCloudinary = async (uri: string) => {
    try {
      setUploading(true);

      const { timestamp, signature, apikey, cloudName, uploadPreset } =
        await getCloudinarySignature();

      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("api_key", apikey);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to make this work!",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // Use string instead of enum
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setPreviewUrl(imageUri); // lihat preview

        const uploadedUrl = await uploadToCloudinary(imageUri);
        onImageUploaded(uploadedUrl);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick or upload image");
      console.error("Image picker error:", error);
    }
  };

  const showImageOptions = () => {
    Alert.alert("Select Image", "Choose how you want to select an image", [
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View className="mb-4">
      <BodyText className="text-gray-700 mb-3 font-medium">Game Image</BodyText>

      {previewUrl && (
        <View className="mb-3">
          <Image
            source={{ uri: previewUrl }}
            className="w-32 h-32 rounded-lg self-center"
            resizeMode="cover"
          />
        </View>
      )}

      <TouchableOpacity
        onPress={showImageOptions}
        disabled={uploading}
        className={`bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 items-center justify-center ${
          uploading ? "opacity-50" : ""
        }`}>
        {uploading ? (
          <View className="items-center">
            <ActivityIndicator size="small" color="#3B82F6" />
            <BodyText className="text-blue-600 mt-2">Uploading...</BodyText>
          </View>
        ) : (
          <View className="items-center">
            <BodyText className="text-blue-600 font-medium">
              {placeholder}
            </BodyText>
            <BodyText className="text-gray-500 text-sm mt-1">
              tap to select photo
            </BodyText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImageUploader;
