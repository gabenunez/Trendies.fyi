import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/client/forms/sidebar";
import GraphArea from "@/components/client/graphArea";
import QueryManager from "@/components/client/queryManager";
import {
  splitParamData,
  internalFetchRequest,
  getCurrentURL,
} from "../lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

const baseUrl = getCurrentURL();

export type StocksType = {
  searchTerm: string;
  data: { error?: string; timestamps: number[]; averages: number[] };
}[];

export type TrendsType = {
  searchTerm: string;
  data: { error?: string; value: number; timestamp: number };
}[];

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const isOGmode = searchParams?.mode === "og";

  if (isOGmode) {
    return {};
  }

  const headersList = headers();
  const currentRequestUrl = headersList.get("x-request-url");

  return {
    metadataBase: new URL(baseUrl),
    openGraph: {
      images: isOGmode
        ? undefined
        : baseUrl + "/og?" + currentRequestUrl?.split("?")[1],
    },
  };
}

export default async function Homepage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let serverFetchedStocks: StocksType = [];
  let serverFetchedTrends: TrendsType = [];
  const ogMode = searchParams.mode === "og";
  const splitMode = searchParams.mode === "split";

  const headersList = headers();
  const currentRequestUrl = headersList.get("x-request-url");

  if (!ogMode && (searchParams.stocks || searchParams.trends)) {
    internalFetchRequest("/api-private/og", {
      url: currentRequestUrl,
    });
  }

  if (searchParams.stocks) {
    let arrOfStocks: string[] = [];
    if (typeof searchParams.stocks === "string") {
      arrOfStocks = splitParamData({
        paramData: searchParams.stocks,
      });
    }

    const arrOfStockPromises = arrOfStocks.map((symbol) =>
      internalFetchRequest("/api-private/stocks", {
        stockSymbol: symbol,
      })
    );

    const allStockData = await Promise.all(arrOfStockPromises);

    serverFetchedStocks = allStockData.map((stockData, index) => {
      return {
        searchTerm: arrOfStocks[index],
        data: stockData,
      };
    });
  }

  if (searchParams.trends) {
    if (typeof searchParams.trends === "string") {
      const googleTrendsQueries = splitParamData({
        paramData: searchParams.trends,
      });

      const arrOfTrendsPromises = googleTrendsQueries.map((query) =>
        internalFetchRequest("/api-private/google-trends", {
          trendsQuery: query,
        })
      );

      const allTrendsData = await Promise.all(arrOfTrendsPromises);

      serverFetchedTrends = allTrendsData.map((item) => {
        return {
          searchTerm: item.trendsQuery,
          data: item.data,
          error: item?.error,
        };
      });
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <aside className="w-full md:w-1/3 p-4 border-r border-gray-600">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-center text-green-500 hover:text-blue-500 transition-colors duration-500 ease-in-out">
          StocksVsTrends
        </h1>
        <QueryManager />
        <Separator className="my-4" />

        <Sidebar
          searchParams={searchParams}
          stockErrors={serverFetchedStocks?.filter((stock) => stock.data.error)}
          trendsErrors={serverFetchedTrends?.filter((trend) => trend.error)}
        />
      </aside>
      <div className="w-full h-full md:w-2/3 p-4 flex flex-col">
        <div className="h-full border rounded-lg border-gray-600 flex-grow">
          <GraphArea
            serverFetchedStocks={serverFetchedStocks?.filter(
              (stock) => !stock.data.error
            )}
            serverFetchedTrends={serverFetchedTrends?.filter(
              (trend) => !trend.error
            )}
            ogMode={Boolean(ogMode)}
            splitMode={Boolean(splitMode)}
          />
        </div>
        <footer className="w-full flex flex-col justify-center items-center bg-gray-700 text-white p-2 mt-4 rounded-lg">
          <div className="flex justify-center items-center text-sm">
            Made with
            <svg
              className="text-red-500 mx-1 h-4 w-4"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            by Gabe Nuñez
          </div>
          <p className="text-xs text-center mt-2">
            Use this tool at your own risk and have fun! :)
          </p>
        </footer>
      </div>
    </div>
  );
}
