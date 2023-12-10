import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReadonlyURLSearchParams } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchData<T>(
  baseUrl: string,
  path: string,
  options?: RequestInit
) {
  const response = await fetch(`${baseUrl}${path}`, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${path}`);
  }

  return response;
}

export async function fetchStockDataFromAPI(stockSymbol: string) {
  return await fetchData(
    `https://www.alphavantage.co`,
    `/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${process.env.ALPHA_ADVANTAGE_API_KEY}&outputSize=compact`
  );
}

export class UserTriggeredError extends Error {}

export function calculatePercentages(numbers: number[]): number[] {
  // Find the highest and lowest numbers in the array
  const maxNum = Math.max(...numbers);
  const minNum = Math.min(...numbers);

  // Calculate relative percentages using Array.map()
  const percentages: number[] = numbers.map((num) =>
    parseFloat(Number(((num - minNum) / (maxNum - minNum)) * 100).toFixed(2))
  );

  return percentages;
}

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const splitParamData = ({ paramData }: { paramData: string | null }) => {
  let arrOfItemsInParam: string[] = [];

  if (paramData) {
    arrOfItemsInParam = paramData?.split(",");
  }

  return arrOfItemsInParam;
};

export const getParamData = ({
  params,
  paramKey,
}: {
  params: URLSearchParams | ReadonlyURLSearchParams;
  paramKey: string;
}) => {
  const paramData = params.get(paramKey);

  const arrOfItemsInParam = splitParamData({ paramData });

  return arrOfItemsInParam;
};

export const addItemToQueryParm = ({
  params,
  paramKey,
  newItem,
}: {
  params: URLSearchParams | ReadonlyURLSearchParams;
  paramKey: string;
  newItem: string;
}) => {
  let arrOfItemsInParam = getParamData({ params, paramKey });

  if (newItem) {
    arrOfItemsInParam = [...arrOfItemsInParam, newItem];
    const updatedQueryData = arrOfItemsInParam?.join(",");
    params.set(paramKey, updatedQueryData);
  }

  return params;
};

export const removeItemFromQueryParm = ({
  params,
  paramKey,
  itemToDelete,
}: {
  params: URLSearchParams | ReadonlyURLSearchParams;
  paramKey: string;
  itemToDelete: string;
}) => {
  let arrOfItemsInParam = getParamData({ params, paramKey });

  const filteredParamData = arrOfItemsInParam
    ?.filter((item) => item !== itemToDelete)
    .join(",");

  if (filteredParamData) {
    params.set(paramKey, filteredParamData);
  } else {
    params.delete(paramKey);
  }

  return params;
};
