import { fetchConfig } from "./configFetch";

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const config = await fetchConfig();
  const response = await fetch(`${config.apiUrl}/auth/register`, {
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

  const result = await response.json();

  if (!response.ok) {
    // Throw error dengan message dari server
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
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    // Throw error dengan message dari server
    throw new Error(result.message || "Registration failed");
  }

  return result;
};
