"use client";

import Graph from "./graph";
import { StocksType, TrendsType } from "@/app/page";

export default function GraphArea({
  serverFetchedStocks,
  serverFetchedTrends,
  ogMode,
  splitMode,
}: {
  serverFetchedStocks: StocksType;
  serverFetchedTrends: TrendsType;
  ogMode: boolean;
  splitMode: boolean;
}) {
  return (
    <Graph
      serverFetchedTrends={serverFetchedTrends}
      serverFetchedStocks={serverFetchedStocks}
      ogMode={ogMode}
      splitMode={splitMode}
    />
  );
}
