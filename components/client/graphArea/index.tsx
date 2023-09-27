"use client";

import Graph from "./graph";

export default function GraphArea({
  hideWelcomeScreen,
  initialStocks,
}: {
  hideWelcomeScreen: boolean;
  initialStocks: [];
}) {
  return (
    <Graph
      initialStocks={initialStocks}
      hideWelcomeScreen={hideWelcomeScreen}
    />
  );
}
