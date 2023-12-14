"use client";

import { useState } from "react";
import BaseSearchInput from "./baseSearchInput";
import { RiStockFill } from "react-icons/ri";
import { useSearchParams, useRouter } from "next/navigation";
import {
  createUrl,
  addItemToQueryParm,
  removeItemFromQueryParm,
} from "@/lib/utils";

export default function StockSymbolInput({
  initialValue,
  errors,
}: {
  initialValue: string;
  errors: {
    searchTerm: string;
    data: {
      error: string;
    };
  }[];
}) {
  const router = useRouter();
  const [inputFinalized, setInputFinalized] = useState(false);

  const initErrorMessage = errors?.find(
    (error) => error.searchTerm === initialValue
  )?.data?.error;

  const [errorMessage, setErrorMessage] = useState(initErrorMessage);

  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const handleSubmission = async (inputText: string) => {
    if (!inputText) {
      setErrorMessage("Please enter Stock Symbol.");
      return;
    }

    const addedItemQueryParams = addItemToQueryParm({
      params: newParams,
      paramKey: "stocks",
      newItem: inputText,
    });

    const updatedQueryParams = removeItemFromQueryParm({
      params: addedItemQueryParams,
      paramKey: "addNew",
      itemToDelete: "stocks",
    });

    router.replace(createUrl("/", updatedQueryParams));
    setInputFinalized(true);
  };

  function removeFromList(inputText: string) {
    const currentStocks = newParams.get("stocks")?.split(",");

    const filteredStocks = currentStocks
      ?.filter((item) => item !== inputText)
      .join(",");

    if (filteredStocks?.length) {
      newParams.set("stocks", filteredStocks);
    } else {
      newParams.delete("stocks");
    }

    router.replace(createUrl("/", newParams));
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
