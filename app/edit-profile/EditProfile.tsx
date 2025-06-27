import {
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAutoDismissMessage } from "@/lib/hooks/useDismissMessage";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import HeadingText from "../components/extras/HeadingText";
import { validateWithZod } from "@/lib/common/validator";
import { userSchema } from "@/lib/validation/validation";
import { upateProfile } from "@/lib/fetcher/usersFetch";
import { Ionicons } from "@expo/vector-icons";
import BodyText from "../components/extras/BodyText";

const EditProfilePage = () => {
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { user, loadUser } = useAuthStore();
  const [roles, setRoles] = useState<("admin" | "user" | "superadmin")[]>([]);

  useAutoDismissMessage(validationError, setValidationError, 5000);

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setRoles(user.roles as ("admin" | "user" | "superadmin")[]);
  }, [user]);

  const handleSave = async () => {
    if (!user?.userId) {
      setError("Invalid User");
      return;
    }

    setValidationError(null);
    const isValid = validateWithZod(
      userSchema,
      { name, email, roles },
      setValidationError,
    );

    if (!isValid) return;

    try {
      setSaving(true);
      await upateProfile(user.userId, {
        email: email.trim(),
        name: name.trim(),
      });

      loadUser();

      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-6 py-8">
      <View className="flex-row items-center mb-8">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <HeadingText className="text-2xl font-bold text-text flex-1">
          Edit Profile
        </HeadingText>
      </View>

      <View className="w-24 h-24 rounded-full bg-primary border justify-center items-center self-center mb-8">
        <BodyText className="text-4xl font-bold text-background">
          {name ? name.charAt(0).toUpperCase() : "U"}
        </BodyText>
      </View>

      <View className="space-y-4 border border-border/20 bg-secondary/20 p-4 rounded-lg mb-6">
        <View className="space-y-2">
          <BodyText className="text-text font-semibold text-base">
            Name
          </BodyText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            className="border border-border rounded-lg px-4 py-3 bg-background text-text"
            placeholderTextColor="#666"
          />
        </View>

        <View className="space-y-2">
          <BodyText className="text-text font-semibold text-base">
            Email
          </BodyText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-border rounded-lg px-4 py-3 bg-background text-text"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {validationError && (
        <View className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
          <BodyText className="text-red-700 text-sm">
            {validationError}
          </BodyText>
        </View>
      )}

      {error && (
        <View className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
          <BodyText className="text-red-700 text-sm">{error}</BodyText>
        </View>
      )}

      {successMsg && (
        <View className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
          <BodyText className="text-green-700 text-sm">{successMsg}</BodyText>
        </View>
      )}

      <View className="space-y-3 mt-auto">
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className={`py-4 rounded-xl items-center ${
            saving ? "bg-gray-400" : "bg-primary"
          }`}>
          {saving ? (
            <View className="flex-row items-center space-x-2">
              <ActivityIndicator size="small" color="white" />
              <BodyText className="text-background font-bold text-base ml-2">
                Saving...
              </BodyText>
            </View>
          ) : (
            <View className="flex-row items-center space-x-2">
              <Ionicons name="save-outline" size={20} color="white" />
              <BodyText className="text-background font-bold text-base ml-2">
                Save Changes
              </BodyText>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          disabled={saving}
          className="py-4 rounded-xl items-center border border-border">
          <BodyText className="text-text font-semibold text-base">
            Cancel
          </BodyText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default EditProfilePage;
