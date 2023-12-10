import { NextResponse } from "next/server";
import { UserTriggeredError } from "@/lib/utils";
import googleTrends from "google-trends-api";

type TrendsRequest = {
  trendsQuery: string;
};

export async function POST(request: Request) {
  try {
    const req: TrendsRequest = await request.json();

    const { trendsQuery } = req;

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

    return NextResponse.json({ data: cleanedData });
  } catch (error: Error | UserTriggeredError | unknown) {
    if (error instanceof UserTriggeredError) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error... Unable to fetch Google Trend!" },
      { status: 500 }
    );
  }
}
