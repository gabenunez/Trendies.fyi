import { type NextRequest } from "next/server";
import { getCurrentURL, internalFetchRequest } from "@/lib/utils";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const req = await request.json();
  const { url } = req;

  if (!url) {
    return Response.json({
      error: "Missing URL",
    });
  }

  try {
    await internalFetchRequest("/api/screenshot", {
      url,
    });

    return Response.json({
      success: "API call started to generate screenshot!",
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      error: "Sorry, something's wrong with the server :(",
    });
  }
}
