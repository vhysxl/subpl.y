import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import UserDetails from "../components/profile/UserDetails";
import HeadingText from "../components/extras/HeadingText";

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
      {/* Avatar */}
      <View className="w-24 h-24 rounded-full bg-primary border justify-center items-center self-center mb-6">
        <Text className="text-4xl font-bold text-background">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Text>
      </View>

      {/* Title */}
      <HeadingText className="text-3xl font-bold text-text text-center mb-8">
        {user?.name || "PROFILE"}
      </HeadingText>

      {/* User Info */}
      <View className="space-y-2 border border-border/20 bg-secondary/20 py-4 px-2 rounded-lg">
        <UserDetails label={"Name"} data={user.name} />
        <UserDetails label={"Email"} data={user.email} />
        <UserDetails label={"Member Since"} createdAt={dateJoined} />
      </View>

      {/* Status Summary */}
      <Text className="text-secondary font-bold text-lg pl-2">
        Order Summary
      </Text>
      <View className="flex-row justify-between bg-backgroundSecondary rounded-2xl overflow-hidden">
        <Link href={"/(orders)/ordersPending"} asChild>
          <TouchableOpacity className="py-6 items-center flex-1">
            <Ionicons name="hourglass-outline" size={28} color="#ffc107" />
            <View className="mt-2 h-10 justify-center">
              <Text className="text-text font-semibold text-sm text-center">
                Waiting for Payment
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <View className="w-[1px] bg-border" />

        <TouchableOpacity
          className=" py-6 items-center flex-1"
          onPress={() => {
            console.log("Processing pressed");
          }}>
          <Ionicons name="reload-circle-outline" size={28} color="#00bfff" />
          <View className="mt-2 h-10 justify-center">
            <Text className="text-text font-semibold text-sm text-center">
              Processing
            </Text>
          </View>
        </TouchableOpacity>

        <View className="w-[1px] bg-border" />

        <TouchableOpacity
          className="py-6 items-center flex-1"
          onPress={() => {
            console.log("Completed pressed");
          }}>
          <Ionicons name="checkmark-outline" size={28} color="#32cd32" />
          <View className="mt-2 h-10 justify-center">
            <Text className="text-text font-semibold text-sm text-center">
              Completed
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
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
