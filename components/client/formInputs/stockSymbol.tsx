"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useStockStore } from "@/stores/stocks";

export default function StockSymbolInput() {
  const [inputText, setInputText] = useState("");
  const stockData = useStockStore((state) => state.stockData);
  const setStockData = useStockStore((state) => state.setStockData);

  const fetchStockData = async () => {
    const data = await fetch("/api/stocks/candles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stockSymbol: inputText }),
    });

    const parsedJS0N = await data.json();
    return parsedJS0N.data;
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      try {
        const fetchedStockData = await fetchStockData();
        setStockData({ ...stockData, [inputText]: fetchedStockData });
      } catch (error) {
        console.log(error);
      }
    }

    if (event.key === "*") {
      const { [inputText]: _, ...newState } = stockData;
      setStockData(newState);
    }
  };

  return (
    <fieldset>
      <Label className="text-gray-300" htmlFor="stockSymbol">
        Stock Symbol
      </Label>
      <Input
        className="bg-gray-700 text-white placeholder-gray-500"
        id="stockSymbol"
        placeholder="Enter stock symbol"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </fieldset>
  );
}
