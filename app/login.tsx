import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native"; // ← Tambahkan ActivityIndicator di sini
import React, { useEffect, useState } from "react";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import SystemMsg from "./components/extras/SystemMsg";
import { useRouter } from "expo-router";
import { loginSchema } from "@/lib/validation";

const Login = () => {
  const { login, authLoading, user } = useAuth(); //ngambil dari context
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  if (user) {
    //redirect kalau ada user authenticated
    return <Redirect href={"/"} />;
  }

  useEffect(() => {
    //back to home handler
    const backAction = () => {
      router.replace("/");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

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
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      //parse result
      const result = await response.json();

      //request gagal exception
      if (!response.ok) {
        setError(`Failed to login, ${result.message}.`);
        return;
      }

      //login pake context
      await login(result.user, result.token);

      //redirect kalau gk kebegal
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  //Redundant parah nanti di benerin
  return (
    <SafeAreaView className="flex-1 bg-black justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-8">Login</Text>

      <Text className="text-white mb-2">Email</Text>
      <TextInput
        className="bg-zinc-800 text-white px-4 py-3 rounded-lg mb-4"
        placeholder="Enter your email"
        autoCapitalize="none"
        placeholderTextColor="#a1a1aa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text className="text-white mb-2">Password</Text>
      <TextInput
        className="bg-zinc-800 text-white px-4 py-3 rounded-lg mb-6"
        placeholder="Enter your password"
        autoCapitalize="none"
        placeholderTextColor="#a1a1aa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <SystemMsg message={error} type="error" />}

      <TouchableOpacity
        className="bg-white py-3 rounded-lg items-center mb-4"
        onPress={handleLogin}
        disabled={isLoading || authLoading}>
        {isLoading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-black font-medium">Login</Text>
        )}
      </TouchableOpacity>

      <Text className="text-zinc-400 text-center">
        Don't have an account?{" "}
        <Link href={"/register"} className="text-white">
          Register
        </Link>
      </Text>
    </SafeAreaView>
  );
};

export default Login;
