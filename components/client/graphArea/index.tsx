"use client";

import Graph from "./graph";
import { StocksType, TrendsType } from "@/app/page";

export default function GraphArea({
  serverFetchedStocks,
  serverFetchedTrends,
  ogMode,
}: {
  serverFetchedStocks: StocksType;
  serverFetchedTrends: TrendsType;
  ogMode: boolean;
}) {
  return (
    <Graph
      serverFetchedTrends={serverFetchedTrends}
      serverFetchedStocks={serverFetchedStocks}
      ogMode={ogMode}
    />
  );
}
