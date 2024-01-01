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

  if (searchParams.toString()) {
    const stocks = searchParams?.get("stocks")?.split(",").join(", ");
    const trends = searchParams?.get("trends")?.split(",").join(", ");

    const onlyParams = request.url.split("?")[1];

    const encodedUrl = btoa(onlyParams);

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

                    marginRight: ".5em",
                    overflowWrap: "break-word",
                    lineHeight: ".9em",
                    flexGrow: 1,
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

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          color: "white",
          backgroundColor: "#1f2937",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            color: "#3c82f6",
          }}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 1024 1024"
            height="10em"
            width="10em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M904 747H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM165.7 621.8l39.7 39.5c3.1 3.1 8.2 3.1 11.3 0l234.7-233.9 97.6 97.3a32.11 32.11 0 0 0 45.2 0l264.2-263.2c3.1-3.1 3.1-8.2 0-11.3l-39.7-39.6a8.03 8.03 0 0 0-11.3 0l-235.7 235-97.7-97.3a32.11 32.11 0 0 0-45.2 0L165.7 610.5a7.94 7.94 0 0 0 0 11.3z"></path>
          </svg>
          <h1
            style={{
              fontSize: "10em",
              display: "flex",
              alignItems: "baseline",
            }}
          >
            Trendies<span style={{ fontSize: ".4em" }}>.fyi</span>
          </h1>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
