import { NextResponse } from "next/server";
import { fetchFinnhubAPI, UserTriggeredError } from "@/lib/utils";

function getUnixTimestampWithSubtraction(days: number): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const currentTimestamp = Date.now();
  const targetTimestamp = currentTimestamp - days * millisecondsPerDay;

  return Math.floor(targetTimestamp / 1000);
}

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const { stockSymbol } = req;

    if (!stockSymbol) {
      throw new UserTriggeredError("Missing stockSymbol");
    }

    const currentUnixTime = getUnixTimestampWithSubtraction(0);
    const thirtyDaysAgoUnixTime = getUnixTimestampWithSubtraction(30);

    // Fetches the past 30 days of trading
    const res = await fetchFinnhubAPI(
      `/stock/candle?symbol=${stockSymbol}&resolution=D&from=${thirtyDaysAgoUnixTime}&to=${currentUnixTime}`
    );

    const data = await res.json();

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error(error);

    if (error instanceof UserTriggeredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unexpected error... Unable to fetch candles!" },
      { status: 500 }
    );
  }
}
