"use client";

import { useState } from "react";
import { useGoogleTrendsStore } from "@/stores/googleTrends";
import { HiTrendingUp } from "react-icons/hi";
import BaseSearchInput from "./baseSearchInput";

export default function TrendsSearchInput({
  handleRemoveLine,
}: {
  handleRemoveLine: () => void;
}) {
  const [inputFinalized, setInputFinalized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const googleTrendsData = useGoogleTrendsStore(
    (state) => state.googleTrendsData
  );

  const setGoogleTrendsData = useGoogleTrendsStore(
    (state) => state.setGoogleTrendsData
  );

  const fetchGoogleTrendsData = async (inputText: string) => {
    const data = await fetch("/api/google-trends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trendsQuery: inputText }),
    });

    const parsedJS0N = await data.json();

    return parsedJS0N.data;
  };

  const handleSubmission = async (inputText: string) => {
    setInputFinalized(true);
    try {
      const fetchedStockData = await fetchGoogleTrendsData(inputText);

      setGoogleTrendsData([
        ...googleTrendsData,
        { searchTerm: inputText, data: fetchedStockData },
      ]);
    } catch (error) {
      setInputFinalized(false);
      console.log(error);
    }
  };

  function removeFromList(inputText: string) {
    setGoogleTrendsData(
      googleTrendsData.filter((trendData) => trendData.searchTerm !== inputText)
    );

    handleRemoveLine();
  }

  return (
    <BaseSearchInput
      htmlId="googleTrendSearch"
      label="Google Trends Query"
      placeholder="Enter Google Trends Query"
      icon={HiTrendingUp}
      inputFinalized={inputFinalized}
      handleSubmission={handleSubmission}
      handleDelete={removeFromList}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
    />
  );
}
