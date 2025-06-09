import { useConfigStore } from "../stores/useConfigStore";

export const fetchConfig = async () => {
  const res = await fetch(`https://vhysxl.github.io/subpl.y/config.json`, {
    headers: {
      "Cache-Control": "no-cache", //biar update
      Pragma: "no-cache",
    },
  });
  const config = await res.json();
  useConfigStore.getState().setApiUrl(config.apiUrl);
};
