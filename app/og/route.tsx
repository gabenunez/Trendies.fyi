import { ImageResponse } from "next/og";
import { internalFetchRequest } from "@/lib/utils";
import { url } from "inspector";

export const runtime = "edge";

function base64ToBinary(base64: string) {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export async function GET(request: Request) {
  const requestURL = new URL(request.url);
  const { searchParams } = requestURL;

  const ogModeDetected = searchParams?.get("ogMode");

  if (ogModeDetected) {
    return Response.json({
      error: "OG Mode Detected",
    });
  }

  const stocks = searchParams?.get("stocks");
  const trends = searchParams?.get("trends");

  const data = await internalFetchRequest(`/api/og`, {
    url: requestURL,
  });

  const convertedGraphImage = base64ToBinary(data);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          color: "white",
        }}
      >
        <img
          src={convertedGraphImage}
          alt="Background Image"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: " 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            display: "flex",
            fontSize: "30px",
            justifyContent: "center",
            alignItems: "center",
            background: "#3b82f575",
            paddingLeft: "10px",
            height: 100,
            width: "100%",
          }}
        >
          <h2>{stocks}</h2>
        </div>
        <div
          style={{
            position: "absolute",
            display: "flex",
            fontSize: "30px",
            justifyContent: "center",
            alignItems: "center",
            background: "#34a85375",
            paddingLeft: "10px",
            height: 100,
            top: 100,
            width: "100%",
          }}
        >
          <h2>{trends}</h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
