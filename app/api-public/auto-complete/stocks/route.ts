import { type NextRequest } from "next/server";
import { fetchStockAutoCompleteFromAPI } from "@/lib/utils";

type StockMatches = {
  bestMatches: {
    "1. symbol": string;
    "2. name": string;
    "3. type": string;
    "4. region": string;
    "5. marketOpen": string;
    "6. marketClose": string;
    "7. timezone": string;
    "8. currency": string;
    "9. matchScore": string;
  }[];
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({
      error: "Missing query string",
    });
  }

  try {
    const data = await fetchStockAutoCompleteFromAPI(query);

    const { bestMatches: stockMatches }: StockMatches = await data.json();

    if (!stockMatches?.length) {
      return Response.json([]);
    }

    const filteredMatches = stockMatches.map((stock) => {
      return {
        name: stock["2. name"],
        symbol: stock["1. symbol"],
      };
    });

    return Response.json(filteredMatches);
  } catch (err) {
    console.error(err);
    return Response.json({
      error: "Sorry, something's wrong with the server :(",
    });
  }
}
