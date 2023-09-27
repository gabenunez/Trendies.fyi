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
import { useState, useEffect } from "react";
import { InitialStocksType } from "../../../app/page";
import { useStockStore } from "@/stores/stocks";

type LineType = {
  component: JSX.Element;
  id: string;
  initialValue?: string;
  initialData?: {};
};

export default function SidebarForm({
  initialStocks,
}: {
  initialStocks: InitialStocksType;
}) {
  const stockData = useStockStore((state) => state.stockData);
  const setStockData = useStockStore((state) => state.setStockData);

  function fetchInitialStocks() {
    let stocks: LineType[] = [];

    if (initialStocks?.length) {
      stocks = initialStocks?.map((stock) => {
        return {
          component: StockSymbolInput,
          id: crypto.randomUUID(),
          initialValue: stock.searchTerm,
          initialData: stock.data,
        };
      });
    }

    return stocks;
  }
  const [openedLines, setOpenLines] = useState<LineType[]>(fetchInitialStocks);

  function handleAddLine(LineType: JSX.Element, initialValue?: string) {
    setOpenLines([
      ...openedLines,
      {
        component: LineType,
        initialValue: initialValue,
        id: crypto.randomUUID(),
      },
    ]);
  }

  function handleRemoveLine(idToFilter: string): void {
    setOpenLines((prevState) =>
      prevState.filter((item) => item.id !== idToFilter)
    );
  }

  useEffect(() => {
    setStockData([...stockData, ...initialStocks]);
  }, []);

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
        const { component: Component, id, initialValue, initialData } = line;
        return (
          <Component
            key={id}
            initialValue={initialValue}
            initialData={initialData}
            handleRemoveLine={() => handleRemoveLine(id)}
          />
        );
      })}
    </form>
  );
}
