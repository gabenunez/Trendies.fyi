"use client";
import { useStockStore } from "@/stores/stocks";
import { useGoogleTrendsStore } from "@/stores/googleTrends";
import { useRouter, useSearchParams } from "next/navigation";

export default function QueryManager() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function generateQueryParam(strings: string[]): string {
    const encodedStrings = strings.map((str) => encodeURIComponent(str));
    return encodedStrings.join(",");
  }

  function updateQueryParam(paramName: string, paramValue: string): void {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(paramName, paramValue);

    // Update the URL without refreshing the page
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

    window.history.replaceState(null, "", newUrl);
  }

  useStockStore.subscribe(({ stockData }) => {
    const queryParam = generateQueryParam(
      stockData.map((stock) => stock.searchTerm)
    );

    updateQueryParam("stocks", queryParam);
  });

  useGoogleTrendsStore.subscribe(({ googleTrendsData }) => {
    const queryParam = generateQueryParam(
      googleTrendsData.map((trendData) => trendData.searchTerm)
    );

    updateQueryParam("trends", queryParam);
  });

  return null;
}
