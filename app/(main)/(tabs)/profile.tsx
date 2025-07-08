import { View, Text, SafeAreaView, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import UserDetails from "@/app/components/ui/UserProfile";
import HeadingText from "@/app/components/ui/HeadingText";


const Profile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const dateJoined = user?.createdAt ? new Date(user.createdAt) : null;

  //autguard
  useAuthGuard();

  //fallback null
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 gap-y-6 bg-background px-6 py-8 justify-start">
      <View className="w-24 h-24 rounded-full bg-primary border justify-center items-center self-center mb-6">
        <Text className="text-4xl font-bold text-background">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Text>
      </View>

      <HeadingText className="text-3xl font-bold text-text text-center mb-8">
        {user?.name || "PROFILE"}
      </HeadingText>

      <View className="space-y-2 border border-border/20 bg-secondary/20 py-4 px-2 rounded-lg">
        <UserDetails label={"Name"} data={user.name} />
        <UserDetails label={"Email"} data={user.email} />
        <UserDetails label={"Member Since"} createdAt={dateJoined} />
      </View>

      {/* DRY WOY NTAR REFACTOR !! */}
      <Pressable
        onPress={() => router.push("/(main)/profile/edit/EditProfile")}
        className="py-3 rounded-xl items-center bg-primary">
        <View className="flex-row gap-x-2 items-center">
          <Ionicons name="create-outline" size={20} color="white" />
          <Text className="text-background font-bold text-base">
            Edit Profile
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(main)/profile/edit/EditPassword")}
        className="py-3 rounded-xl items-center bg-accent">
        <View className="flex-row gap-x-2 items-center">
          <Ionicons name="lock-closed-outline" size={20} color="white" />
          <Text className="text-background font-bold text-base">
            Change Password
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(main)/orders")}
        className="py-3 rounded-xl items-center bg-secondary">
        <View className="flex-row gap-x-2 items-center">
          <Ionicons name="cube-outline" size={20} color="white" />
          <Text className="text-background font-bold text-base">My Orders</Text>
        </View>
      </Pressable>

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

export default Profile;
