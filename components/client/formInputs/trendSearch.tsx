"use client";

import { useState } from "react";
import { HiTrendingUp } from "react-icons/hi";
import BaseSearchInput from "./baseSearchInput";
import { useSearchParams, useRouter } from "next/navigation";
import {
  createUrl,
  addItemToQueryParm,
  removeItemFromQueryParm,
  removeIndexFromQueryParm,
} from "@/lib/utils";

export default function TrendsSearchInput({
  initialValue,
  errors,
  index,
}: {
  initialValue: string;
  index: number;
}) {
  const router = useRouter();
  const [inputFinalized, setInputFinalized] = useState(false);

  const initErrorMessage = errors?.find(
    (error) => error.searchTerm === initialValue
  )?.error;

  const [errorMessage, setErrorMessage] = useState(initErrorMessage);

  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const handleSubmission = async (inputText: string) => {
    if (!inputText) {
      setErrorMessage("Please enter Google Trends query.");
      return;
    }

    const addedItemQueryParams = addItemToQueryParm({
      params: newParams,
      paramKey: "trends",
      newItem: inputText,
    });

    const addedColorQueryParams = addItemToQueryParm({
      params: addedItemQueryParams,
      paramKey: "trendsColors",
      newItem: "#22c55d",
    });

    const updatedQueryParams = removeItemFromQueryParm({
      params: addedColorQueryParams,
      paramKey: "addNew",
      itemToDelete: "trends",
    });

    router.replace(createUrl("/", updatedQueryParams));
    setInputFinalized(true);
  };

  function removeFromList(inputText: string) {
    let updatedQueryParams;

    if (inputText === null) {
      updatedQueryParams = removeItemFromQueryParm({
        params: newParams,
        paramKey: "addNew",
        itemToDelete: "trends",
      });
    } else {
      updatedQueryParams = removeItemFromQueryParm({
        params: newParams,
        paramKey: "trends",
        itemToDelete: inputText,
      });

      updatedQueryParams = removeIndexFromQueryParm({
        params: updatedQueryParams,
        paramKey: "trendsColors",
        index,
      });
    }

    router.replace(createUrl("/", updatedQueryParams));
  }

  const handleAutocomplete = async (inputText: string) => {
    try {
      const data = await fetch(
        `/api-public/auto-complete/trends?query=${encodeURI(inputText)}`,
        { next: { revalidate: 86400 } }
      );

      const jsonData = await data.json();

      const formattedData = jsonData.map((item) => {
        return {
          name: `${item.name} (${item.type})`,
          value: item.name,
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
      htmlId="googleTrendSearch"
      label="Google Trends Query"
      placeholder="Enter Google Trends Query"
      icon={HiTrendingUp}
      inputFinalized={Boolean(initialValue || inputFinalized)}
      handleSubmission={handleSubmission}
      handleDelete={removeFromList}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      initialValue={initialValue}
      handleAutocomplete={handleAutocomplete}
      relativeIndex={index}
      colorQueryParamName="trendsColors"
    />
  );
}
