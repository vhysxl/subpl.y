import { ZodObject, ZodRawShape } from "zod";

export const validateWithZod = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  data: unknown,
  setError: (msg: string | null) => void,
  isLoading?: (loading: boolean) => void,
): boolean => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const error = result.error.errors[0]?.message || "Invalid input";
    setError(error);
    if (isLoading) isLoading(false);
    return false;
  }

  return true;
};
