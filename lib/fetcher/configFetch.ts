import { useConfigStore } from "../stores/useConfigStore";

export const fetchConfig = async () => {
  const res = await fetch(`https://vhysxl.github.io/subpl.y/config.json`, {
    headers: {
      "Cache-Control": "no-cache", //biar update
      Pragma: "no-cache",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
    },
  });
  const config = await res.json();
  useConfigStore.getState().setApiUrl(config.apiUrl);
  return config;
};
