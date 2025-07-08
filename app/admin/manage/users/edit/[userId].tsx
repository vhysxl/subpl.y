import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteUser, getUserById, updateUser } from "@/lib/fetcher/usersFetch";
import { User } from "@/type";
import SystemMsg from "@/app/components/ui/SystemMsg";
import HeadingText from "@/app/components/ui/HeadingText";
import BodyText from "@/app/components/ui/BodyText";
import { formatDate } from "@/lib/common/formatDate";
import AdminButton from "../../../../components/admin/AdminButton";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import AdminBack from "../../../../components/admin/AdminBack";
import AdminEditFields from "../../../../components/admin/AdminEditFields";
import { userSchema } from "@/lib/validation/validation";
import { validateWithZod } from "@/lib/common/validator";
import { useAutoDismissMessage } from "@/lib/hooks/useDismissMessage";
import { Picker } from "@react-native-picker/picker";

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
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);

  useAutoDismissMessage(validationError, setValidationError, 5000);

  const availableRoles = isSuperAdminUser
    ? (["user", "admin", "superadmin"] as const)
    : (["user", "admin"] as const);

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

      const userRoles = userData.roles as string[];

      // Handle superadmin - jangan biarkan diedit rolenya
      if (userRoles.includes("superadmin")) {
        setSelectedRole("superadmin");
        setIsSuperAdminUser(true); // Add state untuk track ini
      } else if (userRoles.includes("admin")) {
        setSelectedRole("admin");
      } else {
        setSelectedRole("user");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setValidationError(null);
    setError(null);

    let roles: ("user" | "admin" | "superadmin")[] = [];

    // Handle superadmin user - jangan ubah rolenya
    if (isSuperAdminUser) {
      roles = ["user", "admin", "superadmin"];
    } else if (selectedRole === "admin") {
      roles = ["user", "admin"];
    } else if (selectedRole === "user") {
      roles = ["user"];
    } else {
      setError("Please select a valid role");
      return;
    }

    const isValid = validateWithZod(
      userSchema,
      { name, email, roles: roles },
      setValidationError,
    );

    if (!isValid) return;

    try {
      setSaving(true);
      await updateUser(userId, {
        name: name.trim(),
        email: email.trim(),
        roles: roles,
      });

      setSuccessMsg("User updated successfully!");
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

          {isSuperAdmin && (
            <View className="mb-4">
              <BodyText className="text-gray-700 mb-3 font-medium">
                Role
              </BodyText>

              {isSuperAdminUser ? (
                // Read-only untuk superadmin user
                <View className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <BodyText className="text-gray-700 font-medium">
                    Super Administrator
                  </BodyText>
                  <BodyText className="text-gray-500 text-sm mt-1">
                    Superadmin role cannot be changed
                  </BodyText>
                </View>
              ) : (
                // Editable untuk user/admin biasa
                <View className="border border-gray-200 rounded-lg">
                  <Picker
                    selectedValue={selectedRole}
                    onValueChange={(value) => setSelectedRole(value)}
                    style={{
                      height: 50,
                      color: "#000000", // Text hitam
                      backgroundColor: "#ffffff",
                    }}>
                    {availableRoles.map((role) => (
                      <Picker.Item
                        key={role}
                        label={role.charAt(0).toUpperCase() + role.slice(1)}
                        value={role}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>
          )}
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
        <AdminButton
          title={saving ? "Deleting..." : "Delete User"}
          onPress={handleDelete}
          type="danger"
          fullWidth
          disabled={saving || isSuperAdminUser} // Disable untuk superadmin
          loading={saving}
        />
      </ScrollView>
    </View>
  );
};

export default EditUserPage;
