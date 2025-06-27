import { User } from "@/type";
import { fetchConfig } from "./configFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userFetch = async (page: number): Promise<User[] | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = await fetchConfig();

    const response = await fetch(`${config.apiUrl}/users?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!result.data) return null;

    return result.data as User[];
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch users: ${error}`);
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const token = await await AsyncStorage.getItem("token");
    const config = await fetchConfig();

    const response = await fetch(`${config.apiUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!result.data) throw new Error("User not found");

    return result.data as User;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch user: ${error}`);
  }
};

export const updateUser = async (
  userId: string,
  userData: {
    email?: string;
    name?: string;
    roles?: ("admin" | "user" | "superadmin")[];
  },
): Promise<User> => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = await fetchConfig();

    const response = await fetch(`${config.apiUrl}/users/admin/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to update user");

    return result.data as User;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to update user: ${error}`);
  }
};

export const upateProfile = async (
  userId: string,
  userData: {
    email?: string;
    name?: string;
  },
): Promise<User> => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = await fetchConfig();

    const response = await fetch(`${config.apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to update user");

    return result.data as User;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to update user: ${error}`);
  }
};

export const deleteUser = async (userId: string): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = await fetchConfig();

    const response = await fetch(`${config.apiUrl}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to delete user");

    return result.message || "User deleted successfully";
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to delete user: ${error}`);
  }
};

export const searchUser = async (name: string): Promise<User[]> => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = await fetchConfig();

    const response = await fetch(`${config.apiUrl}/users/search?name=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Search failed:", result.message || result);
    }
    if (!result.data) return [];

    return result.data as User[];
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to search user: ${error}`);
  }
};
