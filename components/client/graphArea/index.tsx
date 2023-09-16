"use client";

import { useStockStore } from "@/app/stores/stocks";

export default function GraphArea() {
  const stockSymbol = useStockStore((state) => state.stockSymbol);

  return <div>{stockSymbol && <h1>Selected Stonk: {stockSymbol}</h1>}</div>;
}
