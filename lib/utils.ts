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

export function getCurrentURL() {
  const { LOCAL_URL, VERCEL_URL } = process.env;

  if (LOCAL_URL) return LOCAL_URL;
  return "https://" + VERCEL_URL;
}

export async function internalFetchRequest<T>(path: string, body?: {}) {
  const currentUrl = getCurrentURL();

  const response = await fetch(currentUrl + path, {
    method: body && "POST",
    headers: {
      "internal-secret": process.env.SVT_INTERNAL_REQUEST_SECRET,
    },
    body: JSON.stringify(body),
    next: { revalidate: 21600 }, // Default cache retention is 6 hours
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${path}`);
  }

  return response.json();
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
  returnDefaultParams,
}: {
  params: URLSearchParams | ReadonlyURLSearchParams;
  paramKey: string;
  returnDefaultParams?: boolean;
}) => {
  const paramData = params.get(paramKey);

  // Quick return all default param data
  if (returnDefaultParams) return paramData;

  const arrOfItemsInParam = splitParamData({ paramData });

  return arrOfItemsInParam;
};

// Function that makes sure the "addNew" param is always at the end (for rendering)
const ensureParamOrder = (
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const addNewParamData = params.get("addNew");

  if (addNewParamData) {
    params.delete("addNew");
    params.set("addNew", addNewParamData);
  }

  return params;
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

  params = ensureParamOrder(params);
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

  const foundIndex = arrOfItemsInParam.indexOf(itemToDelete);

  if (foundIndex !== -1) {
    arrOfItemsInParam.splice(foundIndex, 1);
  }

  if (arrOfItemsInParam?.length) {
    const filteredParamData = arrOfItemsInParam.join(",");
    params.set(paramKey, filteredParamData);
  } else {
    params.delete(paramKey);
  }

  params = ensureParamOrder(params);

  return params;
};

export const isInQueryParam = ({
  params,
  paramKey,
  item,
}: {
  params: URLSearchParams | ReadonlyURLSearchParams;
  paramKey: string;
  item: string;
}) => {
  const paramData = getParamData({ params, paramKey });
  if (Array.isArray(paramData) && paramData?.length) {
    return paramData.includes(item);
  }
  return false;
};
