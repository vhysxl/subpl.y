import { Link, Redirect, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import SystemMsg from "./components/extras/SystemMsg";
import { registerSchema } from "@/lib/validation/validation";
import AuthField from "./components/auth/AuthField";
import AuthButton from "./components/auth/AuthButton";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useConfigStore } from "@/lib/stores/useConfigStore";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuthStore();
  const { apiUrl } = useConfigStore();
  const router = useRouter();

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

      if (password !== confirmPassword) {
        setError("Password not match with confirm password");
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
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (user) {
        //redirect kalau ada user authenticated
        return <Redirect href={"/"} />;
      }

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

  //cleanup logic
  useFocusEffect(
    //cleanup error handler
    useCallback(() => {
      // Tidak perlu melakukan apa-apa saat fokus

      return () => {
        setError(""); // Bersihkan error saat screen tidak lagi difokuskan
      };
    }, []),
  );

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
        <Link href="/login" className="text-secondary underline">
          Login
        </Link>
      </Text>
    </SafeAreaView>
  );
}
