"use client";

import Graph from "./graph";
import { StocksType } from "@/app/page";

export default function GraphArea({
  serverFetchedStocks,
}: {
  serverFetchedStocks: StocksType;
}) {
  return <Graph serverFetchedStocks={serverFetchedStocks} />;
}
