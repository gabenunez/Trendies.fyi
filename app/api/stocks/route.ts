import { fetchStockDataFromAPI, calculatePercentages } from "@/lib/utils";

function getUnixTimestampWithSubtraction(days: number): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const currentTimestamp = Date.now();
  const targetTimestamp = currentTimestamp - days * millisecondsPerDay;

  return Math.floor(targetTimestamp / 1000);
}

export async function POST(request: Request) {
  const req = await request.json();
  const { stockSymbol } = req;

  if (!stockSymbol) {
    return Response.json({
      error: "Missing stockSymbol",
    });
  }

  try {
    // Fetches past 100 days of trading
    const res = await fetchStockDataFromAPI(stockSymbol);

    const data = await res.json();

    if (data?.["Error Message"]) {
      return Response.json({ error: "No stock data found." });
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

    const thirtyDaysAgoTimestamp = getUnixTimestampWithSubtraction(31);

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

    return Response.json(cleansedReturndData);
  } catch (err) {
    console.error(err);
    return Response.json({
      error: "Sorry, something's wrong with the server :(",
    });
  }
}
