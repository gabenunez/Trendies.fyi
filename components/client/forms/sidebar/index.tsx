"use server";

import StockSymbolInput from "@/components/client/formInputs/stockSymbol";
import TrendsSearchInput from "@/components/client/formInputs/trendSearch";
import { StocksType } from "@/app/page";
import Dropdown from "./dropdown";
import { splitParamData } from "@/lib/utils";
import { LineTypes } from "./types";

type FormInputType = {
  component: JSX.Element;
  id: string;
  initialValue?: string;
  initialData?: {};
};

export default async function SidebarForm({
  serverFetchedStocks,
  searchParams,
}: {
  serverFetchedStocks: StocksType;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let displayedInputs: FormInputType[] = [];

  if (serverFetchedStocks?.length) {
    displayedInputs = serverFetchedStocks?.map((stock) => {
      return {
        component: StockSymbolInput,
        id: crypto.randomUUID(),
        initialValue: stock.searchTerm,
      };
    });
  }

  // Logic for adding new inputs
  if (searchParams.addNew) {
    if (typeof searchParams.addNew === "string") {
      const arrOfNewFields = splitParamData({
        paramData: searchParams.addNew,
      });

      // Overcome the typeerror, refactor later?
      const arrOfEditableLineTypes: LineTypes[] = arrOfNewFields.map(
        (item) => item as LineTypes
      );

      if (arrOfEditableLineTypes.length) {
        const componentMappings: { [K in LineTypes]: JSX.Element } = {
          stocks: StockSymbolInput,
          trends: TrendsSearchInput,
        };

        const newEditableFields = arrOfEditableLineTypes.map((item) => {
          return {
            component: componentMappings[item],
            id: crypto.randomUUID(),
          };
        });

        displayedInputs = [...displayedInputs, ...newEditableFields];
      }
    }
  }

  return (
    <form className="space-y-4">
      <Dropdown />

      {displayedInputs.map((line) => {
        const { component: Component, id, initialValue, initialData } = line;
        return (
          <Component
            key={id}
            initialValue={initialValue}
            initialData={initialData}
          />
        );
      })}
    </form>
  );
}
