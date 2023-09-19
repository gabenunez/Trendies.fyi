"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGoogleTrendsStore } from "@/stores/googleTrends";
import { HiTrendingUp } from "react-icons/hi";
import { CiCircleRemove, CiSearch } from "react-icons/ci";
import { MouseEvent, KeyboardEvent } from "react";

export default function TrendsSearchInput({
  handleRemoveLine,
}: {
  handleRemoveLine: () => void;
}) {
  const [inputText, setInputText] = useState("");
  const [inputFinalized, setInputFinalized] = useState(false);

  const googleTrendsData = useGoogleTrendsStore(
    (state) => state.googleTrendsData
  );

  const setGoogleTrendsData = useGoogleTrendsStore(
    (state) => state.setGoogleTrendsData
  );

  const fetchGoogleTrendsData = async () => {
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

  const handleSubmission = async (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    setInputFinalized(true);
    try {
      const fetchedStockData = await fetchGoogleTrendsData();

      setGoogleTrendsData([
        ...googleTrendsData,
        { searchTerm: inputText, data: fetchedStockData },
      ]);
    } catch (error) {
      setInputFinalized(false);
      console.log(error);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      await handleSubmission(event);
    }
  };

  function removeFromList() {
    setGoogleTrendsData(
      googleTrendsData.filter((trendData) => trendData.searchTerm !== inputText)
    );

    handleRemoveLine();
  }

  return (
    <fieldset>
      <Label hidden className="text-gray-300" htmlFor="trendQuery">
        Trends Search Query
      </Label>
      <div className="flex items-center">
        <HiTrendingUp size="1.8em" className="mr-2" />
        <Input
          className="bg-gray-700 text-white placeholder-gray-500"
          id="trendQuery"
          placeholder="Enter Google Trends Query"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={inputFinalized}
        />
        {inputFinalized ? (
          <Button
            onClick={removeFromList}
            className="ml-1 px-1"
            variant="ghost"
          >
            <CiCircleRemove size="1.8em" />
          </Button>
        ) : (
          <Button
            className="ml-1 px-1"
            variant="ghost"
            onClick={handleSubmission}
          >
            <CiSearch size="1.8em" />
          </Button>
        )}
      </div>
    </fieldset>
  );
}
