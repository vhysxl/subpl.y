import AsyncStorage from "@react-native-async-storage/async-storage";

const getConfig = async () => {
  const res = await fetch("https://vhysxl.github.io/subpl.y/config.json");
  return await res.json();
};

export const getUploadSignature = async () => {
  try {
    const config = await getConfig();
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${config.apiUrl}/upload`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get upload signature");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("getUploadSignature error:", error);
    throw error;
  }
};

export const uploadImageToCloudinary = async (imageUri: string) => {
  try {
    const signature = await getUploadSignature();

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "image.jpg",
    } as any);
    formData.append("timestamp", signature.timestamp.toString());
    formData.append("signature", signature.signature);
    formData.append("api_key", signature.apikey);
    formData.append("upload_preset", signature.uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error("uploadImageToCloudinary error:", error);
    throw error;
  }
};
