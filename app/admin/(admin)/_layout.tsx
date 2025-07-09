import React, { useEffect } from "react";
import { Tabs, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { BackHandler } from "react-native";

const AdminLayout = () => {
  const { isAdmin, isSuperAdmin, user } = useAuthStore();
  const router = useRouter();

  //disable backhandler
  useFocusEffect(
    React.useCallback(() => {
      if (isAdmin || isSuperAdmin) {
        const onBackPress = () => {
          return true;
        };

        const subscription = BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress,
        );

        return () => subscription?.remove();
      }
    }, [isAdmin, isSuperAdmin]),
  );

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user && !isAdmin && !isSuperAdmin) {
      router.replace("/");
    }
  }, [user, isAdmin, isSuperAdmin, router]);

  if (!isAdmin && !isSuperAdmin) {
    return null;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#8497e6",
        animation: "shift",
        tabBarStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          color: colors.text,
          fontFamily: "Fredoka Regular",
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "DASHBOARD",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "ORDERS",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: "PRODUCTS",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cube" : "cube-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "USERS",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="games"
        options={{
          title: "GAMES",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "game-controller" : "game-controller-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default AdminLayout;
