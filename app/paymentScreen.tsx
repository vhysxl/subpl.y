import React from "react";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useProductStore } from "@/lib/stores/useProductStores";

const PaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { fetchProducts } = useProductStore();

  const paymentUrl = Array.isArray(params.paymentUrl)
    ? params.paymentUrl[0]
    : params.paymentUrl;

  if (!paymentUrl) {
    return <Redirect href="/" />;
  }

  const handleNavigationChange = async (navState: any) => {
    const url = navState.url;

    if (url.includes("success")) {
      router.replace("/paymentSuccess");
    } else if (
      url === "https://simulator.sandbox.midtrans.com/v2/deeplink/payment"
    ) {
      try {
        await fetchProducts();
      } catch (error) {
        console.error("Failed to refresh products:", error);
      } finally {
        router.replace("/");
      }
    }
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      style={styles.container}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      onNavigationStateChange={handleNavigationChange}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

export default PaymentScreen;
