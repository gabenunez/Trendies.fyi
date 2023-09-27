"use client";

import { useState } from "react";
import { useStockStore } from "@/stores/stocks";
import BaseSearchInput from "./baseSearchInput";
import { RiStockFill } from "react-icons/ri";

export const fetchStockData = async (inputText: string) => {
  const data = await fetch("/api/stocks/candles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stockSymbol: inputText }),
  });

  const parsedJS0N = await data.json();

  // Handle 400/500 Errors
  if (!data.ok) {
    throw parsedJS0N;
  }

  return parsedJS0N.data;
};

export default function StockSymbolInput({
  handleRemoveLine,
  initialValue,
}: {
  handleRemoveLine: () => void;
  initialValue: string;
  initialData: {};
}) {
  const [inputFinalized, setInputFinalized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stockData = useStockStore((state) => state.stockData);
  const setStockData = useStockStore((state) => state.setStockData);

  const handleSubmission = async (inputText: string) => {
    setStockData([...stockData, { searchTerm: inputText }]);
  };

  function removeFromList(inputText: string) {
    // Ideally we get here
    setStockData(stockData.filter((data) => data.searchTerm !== inputText));

    handleRemoveLine();
  }

  return (
    <BaseSearchInput
      htmlId="stockTickerSymbol"
      icon={RiStockFill}
      label="Stock Ticker"
      placeholder="Enter Stock Ticker Symbol"
      inputFinalized={Boolean(initialValue || inputFinalized)}
      handleSubmission={handleSubmission}
      handleDelete={removeFromList}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      initialValue={initialValue}
    />
  );
}
