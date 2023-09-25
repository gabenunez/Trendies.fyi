"use client";

import { useState } from "react";
import { useStockStore } from "@/stores/stocks";
import BaseSearchInput from "./baseSearchInput";
import { RiStockFill } from "react-icons/ri";

export default function StockSymbolInput({
  handleRemoveLine,
}: {
  handleRemoveLine: () => void;
}) {
  const [inputFinalized, setInputFinalized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stockData = useStockStore((state) => state.stockData);
  const setStockData = useStockStore((state) => state.setStockData);

  const fetchStockData = async (inputText: string) => {
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

  const handleSubmission = async (inputText: string) => {
    setInputFinalized(true);
    try {
      const fetchedStockData = await fetchStockData(inputText);

      setStockData([
        ...stockData,
        { searchTerm: inputText, data: fetchedStockData },
      ]);
    } catch (error) {
      if (error?.message) {
        setErrorMessage(error?.message);
      } else {
        setErrorMessage("Unable to fetch stock data. Please try again later.");
      }

      setInputFinalized(false);
    }
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
      inputFinalized={inputFinalized}
      handleSubmission={handleSubmission}
      handleDelete={removeFromList}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
    />
  );
}
