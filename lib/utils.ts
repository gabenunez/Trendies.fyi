import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export async function fetchFinnhubAPI(path: string, options?: RequestInit) {
  return await fetchData("https://finnhub.io/api/v1", path, {
    ...options,
    headers: {
      ...options?.headers,
      "X-Finnhub-Token": process.env.FINNHUB_API_KEY ?? "",
    },
  });
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
