"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useStockStore } from "@/app/stores/stocks";

export default function StockSymbolInput() {
  const [inputText, setInputText] = useState("");

  return (
    <fieldset>
      <Label className="text-gray-300" htmlFor="stockSymbol">
        Stock Symbol
      </Label>
      <Input
        className="bg-gray-700 text-white placeholder-gray-500"
        id="stockSymbol"
        placeholder="Enter stock symbol"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
    </fieldset>
  );
}
