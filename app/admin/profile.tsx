import { View, Text, SafeAreaView, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import HeadingText from "../components/extras/HeadingText";
import UserDetails from "../components/profile/UserDetails";

const AdminProfile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const dateJoined = user.createdAt ? new Date(user.createdAt) : null;

  return (
    <SafeAreaView className="flex-1 gap-y-6 bg-background px-6 py-8 justify-start">
      {/* Avatar */}
      <View className="w-24 h-24 rounded-full bg-primary border justify-center items-center self-center mb-6">
        <Text className="text-4xl font-bold text-background">
          {user.name?.charAt(0).toUpperCase() || "A"}
        </Text>
      </View>

      {/* Heading */}
      <HeadingText className="text-3xl font-bold text-text text-center mb-2">
        {user.name || "Admin"}
      </HeadingText>

      {/* Info */}
      <View className="space-y-2 border border-border/20 bg-secondary/20 py-4 px-2 rounded-lg">
        <UserDetails label="Name" data={user.name} />
        <UserDetails label="Email" data={user.email} />
        <UserDetails label="Roles" data={user.roles.join(", ")} />
        <UserDetails label="Member Since" createdAt={dateJoined} />
      </View>

      {/* Logout */}
      <Pressable
        onPress={() => {
          logout();
          router.replace("/login");
        }}
        className="mt-auto py-3 rounded-xl items-center">
        <View className="flex-row gap-x-2 items-center">
          <Text className="text-red-600 font-bold text-base">Sign Out</Text>
          <Ionicons name="log-out-outline" size={28} color="red" />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default AdminProfile;
