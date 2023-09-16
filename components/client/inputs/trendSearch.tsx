"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function TrendsSearchInput() {
  const [inputText, setInputText] = useState("");

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
      />
    </fieldset>
  );
}
