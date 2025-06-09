import { create } from "zustand";

interface ConfigState {
  apiUrl: string | null;
  setApiUrl: (url: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  apiUrl: null,
  setApiUrl: (url) => set({ apiUrl: url }),
}));
