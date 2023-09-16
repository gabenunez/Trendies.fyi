import { create } from "zustand";

interface StocksState {
  stockSymbol: string;
  setStockSymbol: (stockSymbol: string) => void;
}

export const useStockStore = create<StocksState>()((set) => ({
  stockSymbol: "",
  setStockSymbol: (stockSymbol) => set((state) => ({ stockSymbol })),
}));
