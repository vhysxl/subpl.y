import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import AuthField from "../components/ui/AuthField";
import AuthButton from "../components/ui/AuthButton";
import { useGuestGuard } from "@/lib/hooks/useGuestGuard";
import { validateWithZod } from "@/lib/common/validator";
import { registerSchema } from "@/lib/validation/validation";
import { register } from "@/lib/fetcher/authFetch";
import SystemMsg from "../components/ui/SystemMsg";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useGuestGuard();

  //register logic
  const handleRegister = async () => {
    try {
      setError("");
      setIsLoading(true);

      const isValid = validateWithZod(
        registerSchema,
        { name, email, password },
        setError,
      );
      if (!isValid) return;

      if (password !== confirmPassword) {
        setError("Password not match with confirm password");
        return;
      }

      await register(name, email, password);

      router.replace("/login");
    } catch (error: any) {
      console.error("Failed to register:", error);
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
        <Text
          className="text-black text-center mx-auto w-2/3 text-3xl mb-8"
          style={{ fontFamily: "Fredoka SemiBold" }}>
          Create an account
        </Text>
      </View>
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
      <AuthField
        autoCapitalize="none"
        secureTextEntry
        placeholder="Type the password again"
        name="Confirm Password"
        value={confirmPassword}
        setValue={setConfirmPassword}
      />
      {error && <SystemMsg message={error} type="error" />}

      <AuthButton
        isLoading={isLoading}
        onPress={handleRegister}
        text={"Register"}
      />

      <Text
        className="text-text text-center "
        style={{ fontFamily: "Nunito Regular" }}>
        Already Subpl.y member?{" "}
        <Link href="/login" replace className="text-secondary underline">
          Login
        </Link>
      </Text>
    </SafeAreaView>
  );
}
