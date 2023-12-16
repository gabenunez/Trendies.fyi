"use client";

import { useState } from "react";
import { HiTrendingUp } from "react-icons/hi";
import BaseSearchInput from "./baseSearchInput";
import { useSearchParams, useRouter } from "next/navigation";
import {
  createUrl,
  addItemToQueryParm,
  removeItemFromQueryParm,
} from "@/lib/utils";

export default function TrendsSearchInput({
  initialValue,
  errors,
}: {
  initialValue: string;
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

    const updatedQueryParams = removeItemFromQueryParm({
      params: addedItemQueryParams,
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
    }

    router.replace(createUrl("/", updatedQueryParams));
  }

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
    />
  );
}
