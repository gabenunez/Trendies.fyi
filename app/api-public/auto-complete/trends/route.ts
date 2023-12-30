import { type NextRequest } from "next/server";
import { fetchStockAutoCompleteFromAPI } from "@/lib/utils";
import googleTrends from "google-trends-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({
      error: "Missing query string",
    });
  }

  try {
    const trendsSuggestions = await googleTrends.autoComplete({
      keyword: query,
    });

    const data = JSON.parse(trendsSuggestions);

    const topics = data.default.topics;

    if (!topics?.length) {
      return Response.json([]);
    }

    const filteredData = topics.map((item) => {
      return {
        name: item.title,
        type: item.type,
      };
    });

    return Response.json(filteredData);
  } catch (err) {
    console.error(err);
    return Response.json({
      error: "Sorry, something's wrong with the server :(",
    });
  }
}
