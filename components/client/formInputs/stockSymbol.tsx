"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStockStore } from "@/stores/stocks";
import { RiStockFill } from "react-icons/ri";
import { CiCircleRemove, CiSearch } from "react-icons/ci";
import { MouseEvent, KeyboardEvent } from "react";

export default function StockSymbolInput({ handleRemoveLine }) {
  const [inputText, setInputText] = useState("");
  const [inputFinalized, setInputFinalized] = useState(false);
  const stockData = useStockStore((state) => state.stockData);
  const setStockData = useStockStore((state) => state.setStockData);

  const fetchStockData = async () => {
    const data = await fetch("/api/stocks/candles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stockSymbol: inputText }),
    });

    const parsedJS0N = await data.json();
    return parsedJS0N.data;
  };

  const handleSubmission = async (event: KeyboardEvent | MouseEvent) => {
    event.preventDefault();
    setInputFinalized(true);
    try {
      const fetchedStockData = await fetchStockData();
      setStockData({ ...stockData, [inputText]: fetchedStockData });
    } catch (error) {
      setInputFinalized(false);
      console.log(error);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSubmission(event);
    }
  };

  function removeFromList() {
    const { [inputText]: _, ...newState } = stockData;
    setStockData(newState);
    handleRemoveLine();
  }

  return (
    <fieldset>
      <Label hidden className="text-gray-300" htmlFor="stockSymbol">
        Stock Symbol
      </Label>
      <div className="flex items-center">
        <RiStockFill size="1.8em" className="mr-2" />
        <Input
          className="bg-gray-700 text-white placeholder-gray-500"
          id="stockSymbol"
          placeholder="Enter Stock Symbol"
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
