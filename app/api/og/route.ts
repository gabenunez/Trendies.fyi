import { type NextRequest } from "next/server";
import captureWebsite from "capture-website";

export async function POST(request: NextRequest) {
  const req = await request.json();
  const { url } = req;

  if (!url) {
    return Response.json({
      error: "Missing URL",
    });
  }

  try {
    const base64Screenshot = await captureWebsite.base64(decodeURI(url), {
      waitForElement: "#graph-area",
      element: "#graph-area",
      timeout: 5,
      styles: [".rounded-lg {border-radius: 0;}"],
    });

    return Response.json(base64Screenshot);
  } catch (err) {
    console.error(err);
    return Response.json({
      error: "Sorry, something's wrong with the server :(",
    });
  }
}
