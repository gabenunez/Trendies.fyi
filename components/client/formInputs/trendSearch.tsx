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
    const currentStocks = newParams.get("trends")?.split(",");

    const filteredStocks = currentStocks
      ?.filter((item) => item !== inputText)
      .join(",");

    if (filteredStocks) {
      newParams.set("trends", filteredStocks);
    } else {
      newParams.delete("trends");
    }

    router.replace(createUrl("/", newParams));
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
