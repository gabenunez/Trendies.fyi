"use client";

import { useState } from "react";
import BaseSearchInput from "./baseSearchInput";
import { RiStockFill } from "react-icons/ri";
import { useSearchParams, useRouter } from "next/navigation";
import {
  createUrl,
  addItemToQueryParm,
  removeItemFromQueryParm,
  removeIndexFromQueryParm,
  getIndexItemFromQueryParm,
  editIndexItemInQueryParm,
} from "@/lib/utils";

export default function StockSymbolInput({
  initialValue,
  errors,
  index,
}: {
  index: number;
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

    const addedColorQueryParams = addItemToQueryParm({
      params: addedItemQueryParams,
      paramKey: "stocksColors",
      newItem: "#3b82f5",
    });

    const updatedQueryParams = removeItemFromQueryParm({
      params: addedColorQueryParams,
      paramKey: "addNew",
      itemToDelete: "stocks",
    });

    router.replace(createUrl("/", updatedQueryParams));
    setInputFinalized(true);
  };

  function removeFromList(inputText: string | null) {
    let updatedQueryParams;
    if (inputText === null) {
      updatedQueryParams = removeItemFromQueryParm({
        params: newParams,
        paramKey: "addNew",
        itemToDelete: "stocks",
      });
    } else {
      updatedQueryParams = removeItemFromQueryParm({
        params: newParams,
        paramKey: "stocks",
        itemToDelete: inputText,
      });

      updatedQueryParams = removeIndexFromQueryParm({
        params: updatedQueryParams,
        paramKey: "stocksColors",
        index,
      });
    }

    router.replace(createUrl("/", updatedQueryParams));
  }

  const handleAutocomplete = async (inputText: string) => {
    try {
      const data = await fetch(
        `/api-public/auto-complete/stocks?query=${encodeURI(inputText)}`,
        { next: { revalidate: 86400 } }
      );

      const jsonData = await data.json();

      const formattedData = jsonData.map((item) => {
        return {
          name: `${item.symbol} (${item.name})`,
          value: item.symbol,
        };
      });
      return formattedData;
    } catch (error) {
      // Silently catch the error, since this can be rate limited
      return [];
    }
  };

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
      handleAutocomplete={handleAutocomplete}
      relativeIndex={index}
      colorQueryParamName="stocksColors"
    />
  );
}
