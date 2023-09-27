import { NextResponse } from "next/server";
import {
  fetchFinnhubAPI,
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
  const currentUnixTime = getUnixTimestampWithSubtraction(0);
  const thirtyDaysAgoUnixTime = getUnixTimestampWithSubtraction(30);

  // Fetches the past 30 days of trading
  const res = await fetchFinnhubAPI(
    `/stock/candle?symbol=${stockSymbol}&resolution=D&from=${thirtyDaysAgoUnixTime}&to=${currentUnixTime}`
  );

  const data = await res.json();

  if (data?.s === "no_data") {
    throw new UserTriggeredError("No stock data found");
  }

  data.averages = calculatePercentages(data.c);

  return data;
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
