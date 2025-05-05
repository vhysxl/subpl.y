import { useAuth } from "@/contexts/AuthContext";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import SystemMsg from "./components/extras/SystemMsg";
import { registerSchema } from "@/lib/validation";
import AuthField from "./components/auth/AuthField";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    //redirect kalau ada user authenticated
    return <Redirect href={"/"} />;
  }

  //register logic
  const handleRegister = async () => {
    try {
      setError("");
      setIsLoading(true);

      //validation layer 1 (kgk butuh sih cuma bodo amat)
      if (!email || !name || !password) {
        setError("Please fill all the required fields");
        return;
      }

      //validation layer 2
      const validationResult = registerSchema.safeParse({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        if (fieldErrors.name) {
          setError(fieldErrors.name[0]);
        } else if (fieldErrors.email) {
          setError(fieldErrors.email[0]);
        } else if (fieldErrors.password) {
          setError(fieldErrors.password[0]);
        } else {
          setError("Invalid input.");
        }

        setIsLoading(false);
        return;
      }

      //request register
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      //parse result
      const result = await response.json();

      //request gagal exception
      if (!response.ok) {
        setError(`Failed to register, ${result.message}.`);
        return;
      }

      //redirect kalau gk kebegal
      router.replace("/login");
    } catch (error) {
      console.error("Failed to register:", error);
      setError("An error occurred, please try again later. 😢");
    } finally {
      setIsLoading(false);
    }
  };

  //Redundant parah nanti di benerin
  return (
    <SafeAreaView className="flex-1 bg-black justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-8">Register</Text>
      <AuthField
        autoCapitalize="words"
        name="Name"
        value={name}
        placeholder="Enter your name"
        setValue={setName}
      />
      <AuthField
        autoCapitalize="none"
        keyboardType="email-address"
        name="Email"
        placeholder="Enter your email"
        value={email}
        setValue={setEmail}
      />
      <AuthField
        autoCapitalize="none"
        secureTextEntry
        placeholder="Enter your password"
        name="Password"
        value={password}
        setValue={setPassword}
      />

      {error && <SystemMsg message={error} type="error" />}

      {isLoading ? (
        <ActivityIndicator color={"black"} />
      ) : (
        <TouchableOpacity
          className="bg-white py-3 rounded-lg items-center mb-4"
          disabled={isLoading}
          onPress={handleRegister}>
          <Text className="text-black text-base font-semibold">Register</Text>
        </TouchableOpacity>
      )}

      <Text className="text-zinc-400 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-white">
          Login
        </Link>
      </Text>
    </SafeAreaView>
  );
}
