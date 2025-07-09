import { fetchConfig } from "./configFetch";

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const config = await fetchConfig();

  console.log(process.env.EXPO_PUBLIC_API_KEY);

  const response = await fetch(`${config.apiUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

export const loginReq = async (email: string, password: string) => {
  const config = await fetchConfig();

  const response = await fetch(`${config.apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};
