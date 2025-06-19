import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be less than 20 characters" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Invalid password" })
    .max(20, { message: "Password must be less than 20 characters" }),
});

export const productSchema = z.object({
  code: z.string().min(1, "Code is required"),
  value: z.coerce
    .number({
      required_error: "Value is required",
      invalid_type_error: "Value must be a number",
    })
    .positive("Value must be a positive number"),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be a positive number"),
  gameId: z.string().min(1, "Game ID is required"),
  type: z.enum(["topup", "voucher"]),
  status: z.enum(["available", "used"]),
});

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  roles: z
    .array(
      z.enum(["user", "admin", "superadmin"], {
        required_error: "Role is required",
        invalid_type_error: "Invalid role selected",
      }),
    )
    .min(1, "At least one role must be selected"),
});

export const gameSchema = z.object({
  name: z.string().min(1, "Game name is required"),
  currency: z.string().min(1, "Game currency is required"),
  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .url("Invalid image URL format"),
  isPopular: z.boolean({
    required_error: "Popular status is required",
    invalid_type_error: "Popular status must be true or false",
  }),
});
