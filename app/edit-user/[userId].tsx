import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteUser, getUserById, updateUser } from "@/lib/fetcher/usersFetch";
import { User } from "@/type";
import BodyText from "../components/extras/BodyText";
import HeadingText from "../components/extras/HeadingText";
import SystemMsg from "../components/extras/SystemMsg";
import { formatDate } from "@/lib/common/formatDate";
import AdminButton from "../components/admin/AdminButton";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import AdminBack from "../components/admin/AdminBack";
import AdminEditFields from "../components/admin/AdminEditFields";
import { userSchema } from "@/lib/validation/validation";
import { validateWithZod } from "@/lib/common/validator";
import { useAutoDismissMessage } from "@/lib/hooks/useDismissMessage";

const EditUserPage = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { isSuperAdmin } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<
    ("admin" | "user" | "superadmin")[]
  >([]);

  useAutoDismissMessage(validationError, setValidationError, 5000);
  const availableRoles = ["user", "admin", "superadmin"] as const;

  useEffect(() => {
    if (isSuperAdmin === false) {
      router.back();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

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

    const isValid = validateWithZod(
      userSchema,
      { name, email, roles: selectedRoles },
      setValidationError,
    );

    if (!isValid) return;

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

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

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
      <AdminBack heading="Edit User" />

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

        <View className="bg-white p-4 rounded-xl mb-6 border border-gray-100">
          <HeadingText className="text-lg mb-4">Edit Information</HeadingText>
          <AdminEditFields
            title="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
          />
          <AdminEditFields
            title="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/* Roles */}
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

        {/* buttons */}
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
