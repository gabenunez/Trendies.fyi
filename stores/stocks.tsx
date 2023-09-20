import { create } from "zustand";

interface StocksState {
  stockData: {}[];
  setStockData: (stockSymbol: {}[]) => void;
}

export const useStockStore = create<StocksState>()((set) => ({
  stockData: [],
  setStockData: (stockData) => set({ stockData }),
}));
