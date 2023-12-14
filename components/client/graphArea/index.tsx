"use client";

import Graph from "./graph";
import { StocksType, TrendsType } from "@/app/page";

export default function GraphArea({
  serverFetchedStocks,
  serverFetchedTrends,
}: {
  serverFetchedStocks: StocksType;
  serverFetchedTrends: TrendsType;
}) {
  return (
    <Graph
      serverFetchedTrends={serverFetchedTrends}
      serverFetchedStocks={serverFetchedStocks}
    />
  );
}
