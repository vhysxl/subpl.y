import { useEffect } from "react";

export const useAutoDismissMessage = (
  message: string | null,
  setMessage: (msg: string | null) => void,
  delay: number = 3000,
) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), delay);
      return () => clearTimeout(timer);
    }
  }, [message, delay, setMessage]);
};
