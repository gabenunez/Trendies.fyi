import { type NextRequest } from "next/server";
import captureWebsite from "capture-website";
import { getCurrentURL } from "@/lib/utils";
import { chromium as devChromium } from "playwright";
import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

export const fetchGraphScreenshotBase64 = async (url: string) => {
  let browser;

  if (process.env.LOCAL_URL) {
    browser = await devChromium.launch();
  } else {
    browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  // Logic to navigate to page and such
  await page.setViewportSize({ width: 1600, height: 762 });
  await page.goto(url);
  // Little CSS hack to fix up the image
  await page.addStyleTag({
    content:
      ".rounded-lg {border-radius: 0 !important;} #graph-area {border: none;} ",
  });
  const screenshotBuffer = await page.locator("#graph-area").screenshot();

  // Teardown
  await context.close();
  await browser.close();

  return screenshotBuffer.toString("base64");
};

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
    // const base64Screenshot = await captureWebsite.base64(formattedUrl, {
    //   waitForElement: "#graph-area",
    //   element: "#graph-area",
    //   timeout: 5,
    //   styles: [".rounded-lg {border-radius: 0;}"],
    // });

    const base64Image = await fetchGraphScreenshotBase64(formattedUrl);

    return Response.json(base64Image);
  } catch (err) {
    console.error(err);
    return Response.json({
      error: "Sorry, something's wrong with the server :(",
    });
  }
}
