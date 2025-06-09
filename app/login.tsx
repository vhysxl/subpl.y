import { SafeAreaView, BackHandler, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import SystemMsg from "./components/extras/SystemMsg";
import { useRouter } from "expo-router";
import { loginSchema } from "@/lib/validation/validation";
import AuthField from "./components/auth/AuthField";
import AuthButton from "./components/auth/AuthButton";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import BodyText from "./components/extras/BodyText";
import HeadingText from "./components/extras/HeadingText";
import { useConfigStore } from "@/lib/stores/useConfigStore";
import { useBackHandler } from "@/lib/hooks/useBackHandler";

const Login = () => {
  const { login } = useAuthStore(); //zustand
  const { apiUrl } = useConfigStore(); //zustand
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  //back handler
  useBackHandler("/");

  //cleanup logic
  useFocusEffect(
    useCallback(() => {
      return () => {
        setError("");
      };
    }, []),
  );

  //login logic
  const handleLogin = async () => {
    try {
      setError("");
      setIsLoading(true);

      //validation layer 1 (kgk butuh sih cuma bodo amat)
      if (!email || !password) {
        setError("Please fill all the required fields");
        return;
      }

      //validation layer 2
      const validationResult = loginSchema.safeParse({
        email,
        password,
      });

      if (!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;

        if (fieldErrors.email) {
          setError(fieldErrors.email[0]);
        } else if (fieldErrors.password) {
          setError(fieldErrors.password[0]);
        } else {
          setError("Invalid input.");
        }

        return;
      }

      //request login
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      //parse result
      const result = await response.json();

      //request gagal exception
      if (!response.ok) {
        setError(`Failed to login, ${result.message}.`);
        return;
      }

      //login pake context
      await login(result.user, result.token);

      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <View>
        <HeadingText
          className="text-text text-center mx-auto w-2/3 text-3xl mb-8"
          style={{ fontFamily: "Fredoka SemiBold" }}>
          Welcome back to Subpl.y
        </HeadingText>
      </View>

      <AuthField
        name="Email"
        placeholder="Enter your email"
        value={email}
        setValue={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <AuthField
        name="Password"
        placeholder="Enter your password"
        value={password}
        setValue={setPassword}
        keyboardType="default"
        autoCapitalize="none"
        secureTextEntry
      />

      {error && <SystemMsg message={error} type="error" />}

      <AuthButton isLoading={isLoading} onPress={handleLogin} text="Login" />

      <BodyText className="text-text text-center">
        New to Subpl.y?{" "}
        <Link href={"/register"} className="text-secondary underline">
          Register
        </Link>
      </BodyText>
    </SafeAreaView>
  );
};

export default Login;
