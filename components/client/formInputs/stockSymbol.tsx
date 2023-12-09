"use client";

import { useState } from "react";
import BaseSearchInput from "./baseSearchInput";
import { RiStockFill } from "react-icons/ri";
import { useSearchParams, useRouter } from "next/navigation";
import { createUrl } from "../../../lib/utils";

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
  initialValue,
}: {
  initialValue: string;
  initialData: {};
}) {
  const router = useRouter();
  const [inputFinalized, setInputFinalized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const handleSubmission = async (inputText: string) => {
    const currentStocks = newParams.get("stocks");
    let arrOfStocks: string[] = [];

    if (currentStocks) {
      arrOfStocks = currentStocks?.split(",");
    }

    if (inputText) {
      arrOfStocks = [...arrOfStocks, inputText];
      const newQueryParm = arrOfStocks?.join(",");
      newParams.set("stocks", newQueryParm);
    }

    router.push(createUrl("/", newParams));
    setInputFinalized(true);
  };

  function removeFromList(inputText: string) {
    const currentStocks = newParams.get("stocks")?.split(",");

    const filteredStocks = currentStocks
      ?.filter((item) => item !== inputText)
      .join(",");

    if (filteredStocks) {
      newParams.set("stocks", filteredStocks);
    }

    router.push(createUrl("/", newParams));
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
