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
import { passwordSchema } from "@/lib/validation/validation"; // Assuming you have this schema
import { Ionicons } from "@expo/vector-icons";
import BodyText from "../components/extras/BodyText";
import { changePassword } from "@/lib/fetcher/usersFetch";

const EditPassword = () => {
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { user, loadUser } = useAuthStore();

  useAutoDismissMessage(validationError, setValidationError, 5000);

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.userId) {
      setError("Invalid User");
      return;
    }

    setValidationError(null);

    if (newPassword !== confirmPassword) {
      setValidationError("New passwords do not match");
      return;
    }

    const isValid = validateWithZod(
      passwordSchema,
      { currentPassword, newPassword, confirmPassword },
      setValidationError,
    );

    if (!isValid) return;

    try {
      setSaving(true);
      await changePassword(currentPassword, newPassword, user.userId);

      setSuccessMsg("Password updated successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        loadUser();
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
          Change Password
        </HeadingText>
      </View>

      <View className="w-24 h-24 rounded-full bg-primary border justify-center items-center self-center mb-8">
        <Ionicons name="lock-closed" size={32} color="white" />
      </View>

      <View className="space-y-4 border border-border/20 bg-secondary/20 p-4 rounded-lg mb-6">
        <View className="space-y-2">
          <BodyText className="text-text font-semibold text-base">
            Current Password
          </BodyText>
          <View className="relative">
            <TextInput
              autoCapitalize="none"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry={!showCurrentPassword}
              className="border border-border rounded-lg px-4 py-3 bg-background text-text pr-12"
              placeholderTextColor="#666"
            />
            <Pressable
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-3">
              <Ionicons
                name={showCurrentPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <View className="space-y-2">
          <BodyText className="text-text font-semibold text-base">
            New Password
          </BodyText>
          <View className="relative">
            <TextInput
              autoCapitalize="none"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry={!showNewPassword}
              className="border border-border rounded-lg px-4 py-3 bg-background text-text pr-12"
              placeholderTextColor="#666"
            />
            <Pressable
              onPress={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-3">
              <Ionicons
                name={showNewPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <View className="space-y-2">
          <BodyText className="text-text font-semibold text-base">
            Confirm New Password
          </BodyText>
          <View className="relative">
            <TextInput
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry={!showConfirmPassword}
              className="border border-border rounded-lg px-4 py-3 bg-background text-text pr-12"
              placeholderTextColor="#666"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3">
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
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

      <View className="space-y-3 gap-3 mt-auto ">
        <Pressable
          onPress={handleSave}
          disabled={
            saving || !currentPassword || !newPassword || !confirmPassword
          }
          className={`py-4 rounded-xl items-center ${
            saving || !currentPassword || !newPassword || !confirmPassword
              ? "bg-gray-400"
              : "bg-primary"
          }`}>
          {saving ? (
            <View className="flex-row items-center space-x-2">
              <ActivityIndicator size="small" color="white" />
              <BodyText className="text-background font-bold text-base ml-2">
                Updating...
              </BodyText>
            </View>
          ) : (
            <View className="flex-row items-center space-x-2">
              <Ionicons name="shield-checkmark" size={20} color="white" />
              <BodyText className="text-background font-bold text-base ml-2">
                Update Password
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

export default EditPassword;
