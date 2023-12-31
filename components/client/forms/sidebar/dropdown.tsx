"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useSearchParams, useRouter } from "next/navigation";
import { createUrl, addItemToQueryParm, isInQueryParam } from "@/lib/utils";
import { LineTypes } from "./types";

export default function Dropdown() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const lineIsAlreadyActive = (item: string) => {
    return isInQueryParam({ params: newParams, paramKey: "addNew", item });
  };

  function handleAddLine(dataType: LineTypes) {
    const updatedParams = addItemToQueryParm({
      params: newParams,
      paramKey: "addNew",
      newItem: dataType,
    });

    router.replace(createUrl("/", updatedParams));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="border-none mb-4 ml-auto px-2 py-2 text-white bg-gray-600 hover:bg-gray-500 hover:text-white h-8 flex justify-end items-center"
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
        <DropdownMenuItem
          disabled={lineIsAlreadyActive("stocks")}
          onClick={() => handleAddLine("stocks")}
        >
          Add Stock Ticker {lineIsAlreadyActive("stocks") && "(Active)"}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={lineIsAlreadyActive("trends")}
          onClick={() => handleAddLine("trends")}
        >
          Add Google Trend {lineIsAlreadyActive("trends") && "(Active)"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
