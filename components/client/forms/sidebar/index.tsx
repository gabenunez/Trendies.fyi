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
  index: number;
};

export default async function SidebarForm({
  searchParams,
  stockErrors,
  trendsErrors,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const componentMappings: { [K in LineTypes]: { component: JSX.Element } } = {
    stocks: { component: StockSymbolInput, errors: stockErrors },
    trends: { component: TrendsSearchInput, errors: trendsErrors },
  };

  const componentKeys = Object.keys(componentMappings);

  let displayedInputs: FormInputType[] = [];
  let addNewInputs: FormInputType[] = [];

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
              component: componentMappings[term as LineTypes].component,
              id: crypto.randomUUID(),
            };
          });
        } else {
          newComponents = terms.map((term, index) => {
            return {
              component: componentMappings[key as LineTypes].component,
              id: crypto.randomUUID(),
              initialValue: term,
              errors: componentMappings[key as LineTypes]?.errors,
              index: index,
            };
          });
        }

        if (key === "addNew") {
          return (addNewInputs = newComponents);
        }

        displayedInputs = [...displayedInputs, ...newComponents];
      }
    });
  }

  displayedInputs = [...displayedInputs, ...addNewInputs];

  return (
    <form className="space-y-4">
      <Dropdown />

      {displayedInputs.map((line) => {
        const {
          component: Component,
          id,
          initialValue,
          initialData,
          errors,
        } = line;
        return (
          <Component
            key={id}
            index={line.index}
            initialValue={initialValue}
            initialData={initialData}
            errors={errors}
          />
        );
      })}
    </form>
  );
}
