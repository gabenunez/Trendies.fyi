import { ImageResponse } from "next/og";
import { internalFetchRequest } from "@/lib/utils";

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

  const params = new URLSearchParams(request.url);

  const ogModeDetected = params?.get("ogMode");

  if (ogModeDetected) {
    return Response.json({
      error: "OG Mode Detected",
    });
  }

  const data = await internalFetchRequest(
    `/api/og`,
    {
      url: requestURL,
    },
    1
  );

  const convertedGraphImage = base64ToBinary(data);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "black",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img width="1200" height="630" src={convertedGraphImage} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
