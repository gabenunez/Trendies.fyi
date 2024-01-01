"use client";

import Graph from "./graph";
import { StocksType, TrendsType } from "@/app/page";

export default function GraphArea({
  serverFetchedStocks,
  serverFetchedTrends,
  ogMode,
  splitMode,
  searchParams,
}: {
  serverFetchedStocks: StocksType;
  serverFetchedTrends: TrendsType;
  ogMode: boolean;
  splitMode: boolean;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Graph
      serverFetchedTrends={serverFetchedTrends}
      serverFetchedStocks={serverFetchedStocks}
      ogMode={ogMode}
      splitMode={splitMode}
      searchParams={searchParams}
    />
  );
}
