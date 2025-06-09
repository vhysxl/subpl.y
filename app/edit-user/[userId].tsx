import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteUser, getUserById, updateUser } from "@/lib/fetcher/usersFetch";
import { User } from "@/type";
import BodyText from "../components/extras/BodyText";
import HeadingText from "../components/extras/HeadingText";
import SystemMsg from "../components/extras/SystemMsg";
import { formatDate } from "@/lib/common/formatDate";
import AdminButton from "../components/admin/AdminButton";
import { useAuthStore } from "@/lib/stores/useAuthStore";

const EditUserPage = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { isSuperAdmin } = useAuthStore();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<
    ("admin" | "user" | "superadmin")[]
  >([]);

  const availableRoles = ["user", "admin", "superadmin"] as const;

  useEffect(() => {
    if (isSuperAdmin === false) {
      router.back();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    console.log(userId);

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => setValidationError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserById(userId);
      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setSelectedRoles(userData.roles as ("admin" | "user" | "superadmin")[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (role: "admin" | "user" | "superadmin") => {
    setValidationError(null);
    setSelectedRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleSave = async () => {
    setValidationError(null);
    setError(null);

    if (selectedRoles.length === 0) {
      setValidationError("At least one role must be selected");
      return;
    }

    try {
      setSaving(true);
      await updateUser(userId, {
        name: name.trim(),
        email: email.trim(),
        roles: selectedRoles,
      });

      setSuccessMsg("User updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              await deleteUser(userId);
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
        <BodyText>Loading user data...</BodyText>
      </View>
    );
  }

  if (error && !user) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-4">
        <SystemMsg message={error} type="error" />
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
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-100 p-2 rounded-lg">
            <BodyText>← Back</BodyText>
          </TouchableOpacity>
          <HeadingText className="text-lg">Edit User</HeadingText>
          <View className="w-16" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <SystemMsg message={successMsg || ""} type="success" />
        <SystemMsg message={error || ""} type="error" />
        <SystemMsg message={validationError || ""} type="error" />

        {/* User Info */}
        <View className="bg-white p-4 rounded-xl mb-6 border border-gray-100">
          <BodyText className="text-gray-500 text-sm mb-2">User ID</BodyText>
          <BodyText className="font-medium mb-3">{user?.userId}</BodyText>

          <BodyText className="text-gray-500 text-sm mb-2">Created At</BodyText>
          <BodyText className="font-medium">
            {formatDate(String(user?.createdAt))}
          </BodyText>
        </View>

        {/* Edit Form */}
        <View className="bg-white p-4 rounded-xl mb-6 border border-gray-100">
          <HeadingText className="text-lg mb-4">Edit Information</HeadingText>

          {/* Name Field */}
          <View className="mb-4">
            <BodyText className="text-gray-700 mb-2 font-medium">Name</BodyText>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setValidationError(null);
              }}
              placeholder="Enter name"
              className="border border-gray-200 rounded-lg px-3 py-3 text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <BodyText className="text-gray-700 mb-2 font-medium">
              Email
            </BodyText>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setValidationError(null);
              }}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-200 rounded-lg px-3 py-3 text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <BodyText className="text-gray-700 mb-3 font-medium">
              Roles
            </BodyText>
            <View className="space-y-2">
              {availableRoles.map((role) => (
                <TouchableOpacity
                  key={role}
                  onPress={() => toggleRole(role)}
                  className={`flex-row items-center p-3 rounded-lg border ${
                    selectedRoles.includes(role)
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 ${
                      selectedRoles.includes(role)
                        ? "bg-primary border-primary"
                        : "border-gray-300"
                    }`}>
                    {selectedRoles.includes(role) && (
                      <BodyText className="text-white text-xs text-center">
                        ✓
                      </BodyText>
                    )}
                  </View>
                  <BodyText
                    className={`capitalize ${
                      selectedRoles.includes(role)
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}>
                    {role}
                  </BodyText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
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
        <View className="mb-10">
          <AdminButton
            title={saving ? "Deleting..." : "Delete User"}
            onPress={handleDelete}
            type="danger"
            fullWidth
            disabled={saving}
            loading={saving}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditUserPage;
