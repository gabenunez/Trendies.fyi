import { ImageResponse } from "next/og";
import { getCurrentURL } from "@/lib/utils";
import { head } from "@vercel/blob";

export const runtime = "edge";

export async function GET(request: Request) {
  const requestURL = new URL(decodeURIComponent(request.url));
  const { searchParams } = requestURL;

  const ogModeDetected = searchParams?.get("ogMode");

  if (ogModeDetected) {
    return Response.json({
      error: "OG Mode Detected",
    });
  }

  const stocks = searchParams?.get("stocks")?.split(",").join(", ");
  const trends = searchParams?.get("trends")?.split(",").join(", ");

  const queryParams = requestURL.toString().split("og")[1];
  const encodedUrl = btoa(getCurrentURL() + queryParams);
  let imageUrl = process.env.BLOB_BASE_URL + encodedUrl + ".png";

  try {
    // Check image exists
    await head(imageUrl);
  } catch (err) {
    imageUrl = "";
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          color: "white",
          backgroundColor: "#1f2937",
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: " 100%",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {stocks && (
            <div
              style={{
                background: "#3b82f575",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "10px",
                width: "100vw",
              }}
            >
              {/* Stocks SVG */}
              <svg
                style={{ flexGrow: 0, marginRight: "1em" }}
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                height="6em"
                width="6em"
              >
                <path d="M8.00488 5.00293H11.0049V14.0029H8.00488V17.0029H6.00488V14.0029H3.00488V5.00293H6.00488V2.00293H8.00488V5.00293ZM18.0049 10.0029H21.0049V19.0029H18.0049V22.0029H16.0049V19.0029H13.0049V10.0029H16.0049V7.00293H18.0049V10.0029Z"></path>
              </svg>
              <h2
                style={{
                  fontSize: "3em",
                  flexShrink: 1,
                  marginRight: ".5em",
                  overflowWrap: "break-word",
                  lineHeight: ".9em",
                }}
              >
                {stocks}
              </h2>
            </div>
          )}

          {trends && (
            <div
              style={{
                background: "#34a85375",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                paddingLeft: "10px",
              }}
            >
              <svg
                style={{ flexGrow: 0, marginRight: "1em" }}
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                height="6em"
                width="6em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <h2
                style={{
                  fontSize: "3em",
                  flexGrow: 1,
                  marginRight: ".5em",
                  overflowWrap: "break-word",
                  lineHeight: ".9em",
                }}
              >
                {trends}
              </h2>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
