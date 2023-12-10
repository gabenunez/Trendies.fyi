import { UserTriggeredError } from "@/lib/utils";
import googleTrends from "google-trends-api";

export async function fetchGoogleTrendsData({
  trendsQuery,
}: {
  trendsQuery: string;
}) {
  try {
    if (!trendsQuery) {
      throw new UserTriggeredError("Missing trendsQuery");
    }

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
      throw new UserTriggeredError(
        "No trends data found. Please try another search."
      );
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

    return { trendsQuery, data: cleanedData };
  } catch (error: Error | UserTriggeredError | unknown) {
    if (error instanceof UserTriggeredError) {
      return { error: true, message: error.message };
    }

    console.error(error);
    return { error: "Unexpected error... Unable to fetch Google Trend!" };
  }
}
