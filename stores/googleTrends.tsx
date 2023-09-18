import { create } from "zustand";

interface GoogleTrendsState {
  googleTrendsData: {}[];
  setGoogleTrendsData: (googleTrendsData: {}[]) => void;
}

export const useGoogleTrendsStore = create<GoogleTrendsState>()((set) => ({
  googleTrendsData: [],
  setGoogleTrendsData: (googleTrendsData) => set({ googleTrendsData }),
}));
