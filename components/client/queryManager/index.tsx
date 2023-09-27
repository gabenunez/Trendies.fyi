"use client";
import { useStockStore } from "@/stores/stocks";
import { useGoogleTrendsStore } from "@/stores/googleTrends";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function QueryManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  function generateQueryParam(strings: string[]): string {
    const encodedStrings = strings.map((str) => encodeURIComponent(str));
    return encodedStrings.join(",");
  }

  function updateQueryParam(paramName: string, paramValue: string): void {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, paramValue);

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
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
