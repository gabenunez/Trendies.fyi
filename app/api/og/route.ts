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

  const formattedUrl =
    getCurrentURL() + "?" + url.split("?")[1] + "&ogMode=true";

  try {
    const base64Image = await internalFetchRequest("/api/screenshot", {
      url: formattedUrl,
    });

    return Response.json(base64Image.image);
  } catch (err) {
    console.error(err);
    return Response.json({
      error: "Sorry, something's wrong with the server :(",
    });
  }
}
