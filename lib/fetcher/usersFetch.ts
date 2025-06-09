import { User } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userFetch = async (page: Number) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`https://vhysxl.github.io/subpl.y/config.json`);
    const config = await res.json();
    const response = await fetch(`${config.apiUrl}/users?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (!result.data) {
      return null;
    }

    const usersData: User[] = result.data;
    return usersData;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch user, ${error}`);
  }
};

//fetchOne
export const getUserById = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`https://vhysxl.github.io/subpl.y/config.json`);
    const config = await res.json();
    const response = await fetch(`${config.apiUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (!result.data) {
      throw new Error("User not found");
    }

    return result.data as User;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch user: ${error}`);
  }
};

// Update user
export const updateUser = async (
  userId: string,
  userData: {
    email?: string;
    name?: string;
    roles?: ("admin" | "user" | "superadmin")[];
  },
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`https://vhysxl.github.io/subpl.y/config.json`);
    const config = await res.json();
    const response = await fetch(`${config.apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update user");
    }

    return result.data as User;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to update user: ${error}`);
  }
};

//delete
export const deleteUser = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`https://vhysxl.github.io/subpl.y/config.json`);
    const config = await res.json();

    const response = await fetch(`${config.apiUrl}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete user");
    }

    return result.message || "User deleted successfully";
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to delete user: ${error}`);
  }
};
