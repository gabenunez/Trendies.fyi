"use client";

import StockSymbolInput from "@/components/client/formInputs/stockSymbol";
import TrendsSearchInput from "@/components/client/formInputs/trendSearch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function SidebarForm() {
  const [openedLines, setOpenLines] = useState<
    { component: JSX.Element; id: string }[]
  >([]);

  function handleAddLine(LineType: JSX.Element) {
    setOpenLines([
      ...openedLines,
      { component: LineType, id: crypto.randomUUID() },
    ]);
  }

  function handleRemoveLine(idToFilter: string): void {
    setOpenLines((prevState) =>
      prevState.filter((item) => item.id !== idToFilter)
    );
  }

  return (
    <form className="space-y-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="mb-4 ml-auto px-2 py-2 text-white bg-gray-600 hover:bg-gray-500 h-8 flex justify-end items-center"
            variant="outline"
          >
            Add Line
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => handleAddLine(StockSymbolInput)}>
            Add Stock Ticker
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddLine(TrendsSearchInput)}>
            Add Google Trend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openedLines.map((line) => {
        const { component: Component, id } = line;
        return (
          <Component key={id} handleRemoveLine={() => handleRemoveLine(id)} />
        );
      })}
    </form>
  );
}
