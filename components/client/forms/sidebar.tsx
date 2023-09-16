"use client";

import StockSymbolInput from "@/components/client/inputs/stockSymbol";
import TrendsSearchInput from "@/components/client/inputs/trendSearch";
import { Button } from "@/components/ui/button";
import { useStockStore } from "@/app/stores/stocks";

// Very helpful w/ understanding this!
// https://epicreact.dev/how-to-type-a-react-form-on-submit-handler/

interface FormElements extends HTMLFormControlsCollection {
  stockSymbol: HTMLInputElement;
  trendQuery: HTMLInputElement;
}

interface SidebarFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function SidebarForm() {
  const setStockSymbol = useStockStore((state) => state.setStockSymbol);

  const handleFormSubmit = (e: React.FormEvent<SidebarFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formElements = form.elements;

    setStockSymbol(formElements.stockSymbol.value);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <StockSymbolInput />
      <TrendsSearchInput />
      <Button
        className="bg-gray-600 hover:bg-gray-500 text-white"
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}
