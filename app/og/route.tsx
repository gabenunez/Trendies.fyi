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
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url");

  if (!urlParam) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  const data = await internalFetchRequest(
    `/api/og`,
    {
      url: urlParam,
    },
    1
  );

  const convertedData = base64ToBinary(data);
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
        <img width="1200" height="630" src={convertedData} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
