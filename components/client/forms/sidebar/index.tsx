"use server";

import StockSymbolInput from "@/components/client/formInputs/stockSymbol";
import TrendsSearchInput from "@/components/client/formInputs/trendSearch";
import Dropdown from "./dropdown";
import { splitParamData } from "@/lib/utils";
import { LineTypes } from "./types";

type FormInputType = {
  component: JSX.Element;
  id: string;
  initialValue?: string;
  initialData?: {};
};

const componentMappings: { [K in LineTypes]: JSX.Element } = {
  stocks: StockSymbolInput,
  trends: TrendsSearchInput,
};

const componentKeys = Object.keys(componentMappings);

export default async function SidebarForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let displayedInputs: FormInputType[] = [];

  if (searchParams) {
    const filteredSearchParamKeys = Object.keys(searchParams).filter(
      (key: string) => {
        if (key === "addNew") return true;
        return componentKeys.includes(key);
      }
    );

    filteredSearchParamKeys?.forEach((key: string) => {
      if (typeof searchParams[key] === "string") {
        const terms = splitParamData({
          paramData: searchParams[key] as string,
        });
        let newComponents = [];

        if (key === "addNew") {
          newComponents = terms.map((term) => {
            return {
              component: componentMappings[term as LineTypes],
              id: crypto.randomUUID(),
            };
          });
        } else {
          newComponents = terms.map((term) => {
            return {
              component: componentMappings[key as LineTypes],
              id: crypto.randomUUID(),
              initialValue: term,
            };
          });
        }

        displayedInputs = [...displayedInputs, ...newComponents];
      }
    });
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
