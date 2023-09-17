import { create } from "zustand";

interface StocksState {
  stockSymbol: string;
  setStockSymbol: (stockSymbol: string) => void;
  stockData: {};
  setStockData: (stockData: object) => void;
}

export const useStockStore = create<StocksState>()((set) => ({
  stockSymbol: "",
  setStockSymbol: (stockSymbol) => set((state) => ({ stockSymbol })),
  stockData: {},
  setStockData: (stockData) => set((state) => ({ stockData })),
}));
