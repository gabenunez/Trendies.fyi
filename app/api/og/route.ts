import { type NextRequest } from "next/server";
import captureWebsite from "capture-website";
import { getCurrentURL } from "@/lib/utils";

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
    const base64Image = await captureWebsite.base64(formattedUrl, {
      waitForElement: "#graph-area",
      element: "#graph-area",
      timeout: 5,
      styles: [".rounded-lg {border-radius: 0;}"],
    });

    return Response.json(base64Image);
  } catch (err) {
    console.error(err);
    return Response.json({
      error: "Sorry, something's wrong with the server :(",
    });
  }
}
