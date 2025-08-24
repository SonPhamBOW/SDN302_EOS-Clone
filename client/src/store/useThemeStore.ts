import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "forest",
      setTheme: (theme: string) => set({ theme }),
    }),
    {
      name: "eos-theme",
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated state:", state);
      },
    }
  )
);

