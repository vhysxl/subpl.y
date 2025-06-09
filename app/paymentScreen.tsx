import React from "react";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";

const paymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paymentUrl = Array.isArray(params.paymentUrl)
    ? params.paymentUrl[0]
    : params.paymentUrl;

  if (!paymentUrl) {
    return <Redirect href={"/"} />;
  }

  return (
    <WebView
      source={{ uri: paymentUrl }}
      style={styles.container}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      onNavigationStateChange={(navstate) => {
        const url = navstate.url;
        if (url.includes("success")) {
          router.replace("/paymentSuccess");
        } else if (
          url === "https://simulator.sandbox.midtrans.com/v2/deeplink/payment"
        ) {
          router.replace("/");
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

export default paymentScreen;
