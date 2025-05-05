import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      if (!user) {
        router.push("/login");
      }
    }, [user]),
  );

  if (!user) {
    return null;
  }

  //DRY PARAH COKKK, MALAS BENERIN.
  return (
    <SafeAreaView className="flex-1 gap-y-6 bg-black px-6 py-8 justify-start">
      {/* Avatar */}
      <View className="w-24 h-24 rounded-full bg-neutral-500 justify-center items-center self-center mb-6">
        <Text className="text-4xl font-bold text-white">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Text>
      </View>

      {/* Title */}
      <Text className="text-3xl font-bold text-white text-center mb-8">
        {user?.name || "PROFILE"}
      </Text>

      {/* User Info */}
      <View className="bg-zinc-900 rounded-2xl overflow-hidden">
        <View className="flex-row justify-between p-4">
          <Text className="text-base text-gray-400 font-medium">Name</Text>
          <Text className="text-base text-white font-semibold">
            {user?.name || "Not set"}
          </Text>
        </View>
        <View className="h-[1px] bg-zinc-700" />
        <View className="flex-row justify-between p-4">
          <Text className="text-base text-gray-400 font-medium">Email</Text>
          <Text className="text-base text-white font-semibold">
            {user?.email || "Not set"}
          </Text>
        </View>
      </View>

      {/* Status Summary */}
      <Text className="text-gray-300 font-bold text-lg pl-2">
        Order Summary
      </Text>
      <View className="flex-row justify-between bg-zinc-900 rounded-2xl overflow-hidden">
        <TouchableOpacity
          className=" py-6 items-center flex-1"
          onPress={() => {
            console.log("Waiting for Payment pressed");
          }}>
          <Ionicons name="hourglass-outline" size={28} color="gold" />
          <View className="mt-2 h-10 justify-center">
            <Text className="text-gray-300 font-semibold text-sm text-center">
              Waiting for Payment
            </Text>
          </View>
        </TouchableOpacity>

        <View className="w-[1px] bg-zinc-700" />

        <TouchableOpacity
          className=" py-6 items-center flex-1"
          onPress={() => {
            console.log("Processing pressed");
          }}>
          <Ionicons
            name="reload-circle-outline"
            size={28}
            color="deepskyblue"
          />
          <View className="mt-2 h-10 justify-center">
            <Text className="text-gray-300 font-semibold text-sm text-center">
              Processing
            </Text>
          </View>
        </TouchableOpacity>

        <View className="w-[1px] bg-zinc-700" />

        <TouchableOpacity
          className="py-6 items-center flex-1"
          onPress={() => {
            console.log("Completed pressed");
          }}>
          <Ionicons name="checkmark-outline" size={28} color="lightgreen" />
          <View className="mt-2 h-10 justify-center">
            <Text className="text-gray-300 font-semibold text-sm text-center">
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
          <Text className="text-red-600 font-bold text-base ">Sign Out</Text>
          <Ionicons name="log-out-outline" size={28} color="red" />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default Profile;
