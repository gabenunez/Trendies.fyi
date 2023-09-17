"use client";

import StockSymbolInput from "@/components/client/formInputs/stockSymbol";
import TrendsSearchInput from "@/components/client/formInputs/trendSearch";

export default function SidebarForm() {
  return (
    <form className="space-y-4">
      <StockSymbolInput />
      <TrendsSearchInput />
    </form>
  );
}
