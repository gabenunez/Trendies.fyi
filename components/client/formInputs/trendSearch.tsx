"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGoogleTrendsStore } from "@/stores/googleTrends";
import { HiTrendingUp } from "react-icons/hi";
import { CiCircleRemove } from "react-icons/ci";

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
        />
        <Button className="ml-1 px-1" variant="ghost">
          <CiCircleRemove size="1.8em" />
        </Button>
      </div>
    </fieldset>
  );
}
