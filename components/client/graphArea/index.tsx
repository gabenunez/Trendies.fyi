"use client";

import Graph from "./graph";
import { StocksType } from "@/app/page";

export default function GraphArea({
  serverFetchedStocks,
  serverFetchedTrends,
}: {
  serverFetchedStocks: StocksType;
}) {
  return (
    <Graph
      serverFetchedTrends={serverFetchedTrends}
      serverFetchedStocks={serverFetchedStocks}
    />
  );
}
