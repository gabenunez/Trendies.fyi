"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGoogleTrendsStore } from "@/stores/googleTrends";

export default function TrendsSearchInput() {
  const [inputText, setInputText] = useState("");
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

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      try {
        const fetchedStockData = await fetchGoogleTrendsData();

        setGoogleTrendsData([
          ...googleTrendsData,
          { searchTerm: inputText, data: fetchedStockData },
        ]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <fieldset>
      <Label className="text-gray-300" htmlFor="trendQuery">
        Trends Search Query
      </Label>
      <Input
        className="bg-gray-700 text-white placeholder-gray-500"
        id="trendQuery"
        placeholder="Enter trends query"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </fieldset>
  );
}
