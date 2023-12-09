import { NextResponse } from "next/server";
import {
  fetchStockDataFromAPI,
  UserTriggeredError,
  calculatePercentages,
} from "@/lib/utils";

function getUnixTimestampWithSubtraction(days: number): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const currentTimestamp = Date.now();
  const targetTimestamp = currentTimestamp - days * millisecondsPerDay;

  return Math.floor(targetTimestamp / 1000);
}

export async function fetchStockCandles(stockSymbol: string) {
  // Fetches past 100 days of trading
  const res = await fetchStockDataFromAPI(stockSymbol);

  const data = await res.json();

  if (data?.["Error Message"]) {
    throw new UserTriggeredError("No stock data found");
  }

  const cleansedReturndData: {
    timestamps: number[];
    prices: number[];
    averages: number[];
  } = {
    timestamps: [],
    prices: [],
    averages: [],
  };

  const dailyData = data["Time Series (Daily)"];

  const thirtyDaysAgoTimestamp = getUnixTimestampWithSubtraction(30);

  cleansedReturndData.timestamps = Object.keys(dailyData).map((date) =>
    Math.floor(new Date(date).getTime() / 1000)
  );

  cleansedReturndData.timestamps = cleansedReturndData.timestamps.filter(
    (timestamp) => thirtyDaysAgoTimestamp < timestamp
  );

  cleansedReturndData.prices = Object.values(dailyData)
    .slice(0, cleansedReturndData.timestamps.length)
    .map((candle) => candle["4. close"]);

  cleansedReturndData.averages = calculatePercentages(
    cleansedReturndData.prices
  );

  return cleansedReturndData;
}

type StockRequest = {
  stockSymbol: string;
};

export async function POST(request: Request) {
  try {
    const req: StockRequest = await request.json();

    const { stockSymbol } = req;

    if (!stockSymbol) {
      throw new UserTriggeredError("Missing stockSymbol");
    }

    const data = await fetchStockCandles(stockSymbol);

    return NextResponse.json({ data });
  } catch (error: Error | UserTriggeredError | unknown) {
    if (error instanceof UserTriggeredError) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 400 }
      );
    }
    console.log(error);
    return NextResponse.json(
      { error: "Unexpected error... Unable to fetch candles!" },
      { status: 500 }
    );
  }
}
