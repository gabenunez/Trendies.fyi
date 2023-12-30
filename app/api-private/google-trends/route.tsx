import { UserTriggeredError } from "@/lib/utils";
import googleTrends from "google-trends-api";

export async function POST(request: Request) {
  const req = await request.json();
  const { trendsQuery } = req;

  if (!trendsQuery) {
    return Response.json({
      error: "Missing trendsQuery",
      trendsQuery,
    });
  }

  try {
    let trendsData;

    try {
      const today: Date = new Date();
      const thirtyDaysAgo: Date = new Date();

      thirtyDaysAgo.setDate(today.getDate() - 30);

      trendsData = await googleTrends.interestOverTime({
        keyword: trendsQuery,
        startTime: thirtyDaysAgo,
        endTime: today,
      });
    } catch (err) {
      throw err;
    }

    const parsedJSON = JSON.parse(trendsData);
    const narrowedDownData = parsedJSON.default.timelineData;
    if (!narrowedDownData?.length) {
      return Response.json({
        error: "No trends data found. Please try another search.",
        trendsQuery,
      });
    }
    const cleanedData = narrowedDownData.map(
      ({
        hasData,
        formattedValue,
        formattedAxisTime,
        formattedTime,
        time,
        ...data
      }) => ({
        ...data,
        timestamp: parseInt(time),
        value: data.value[0],
      })
    );

    return Response.json({ trendsQuery, data: cleanedData });
  } catch (error: Error | UserTriggeredError | unknown) {
    console.error(error);
    return Response.json({
      error: "Unexpected error... Unable to fetch Google Trend!",
      trendsQuery,
    });
  }
}
