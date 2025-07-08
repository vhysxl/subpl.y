import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Link, useRouter } from "expo-router";
import AuthField from "../components/ui/AuthField";
import AuthButton from "../components/ui/AuthButton";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useGuestGuard } from "@/lib/hooks/useGuestGuard";
import { validateWithZod } from "@/lib/common/validator";
import { loginSchema } from "@/lib/validation/validation";
import { loginReq } from "@/lib/fetcher/authFetch";
import BodyText from "../components/ui/BodyText";
import HeadingText from "../components/ui/HeadingText";
import SystemMsg from "../components/ui/SystemMsg";

const Login = () => {
  const { login } = useAuthStore(); //zustand
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useGuestGuard();

  //login logic
  const handleLogin = async () => {
    try {
      setError("");
      setIsLoading(true);

      const isValid = validateWithZod(
        loginSchema,
        { email, password },
        setError,
      );
      if (!isValid) return;

      //request login
      const result = await loginReq(email, password);

      //login pake zustand
      await login(result.user, result.token);

      router.replace("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => setError("");
  }, []);

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
        <Link
          href={"/register"}
          replace
          className="text-secondary underline">
          Register
        </Link>
      </BodyText>
    </SafeAreaView>
  );
};

export default Login;
