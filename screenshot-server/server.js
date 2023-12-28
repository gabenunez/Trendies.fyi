import "dotenv/config";
import express from "express";
import puppeteer from "puppeteer";
import { put } from "@vercel/blob";
import { Cluster } from "puppeteer-cluster";

const app = express();
app.use(express.json());

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 1,
    puppeteerOptions: {
      headless: "new",
    },
  });
  await cluster.task(async ({ page, data: url }) => {
    // Set screen size
    await page.setViewport({ width: 1851, height: 698 });

    // Navigate the page to a URL
    await page.goto(url + "&ogMode=true");

    // Apply styling
    await page.addStyleTag({ content: ".rounded-lg {border-radius: 0;}" });

    // Select graph area
    const element = await page.waitForSelector("#graph-area .recharts-wrapper");

    // Take a screenshot
    const graphScreenshot = await element.screenshot();

    return graphScreenshot;
  });

  app.post("/", async (req, res) => {
    const { url } = req.body;

    if (
      req.header("internal-secret") !== process.env.SVT_INTERNAL_REQUEST_SECRET
    ) {
      return res
        .status(401)
        .json({ error: "Sorry, this is an invitation only kinda party." });
    }

    try {
      res.json({ status: "Processing request!" });

      const graphScreenshot = await cluster.execute(url);
      const paramsOnly = url.split("?")[1];

      console.log("Params only", paramsOnly);

      // Add it to the blob store!
      const data = await put(btoa(paramsOnly) + ".png", graphScreenshot, {
        access: "public",
        addRandomSuffix: false,
      });
      console.log(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to fetch image." });
    }
  });

  app.head("/", async (req, res) => {
    return res.json({ status: "We're up and running!" });
  });

  const port = process.env.PORT || 1818;

  app.listen(port, () =>
    console.log(`Screenshot server listening on port ${port}`)
  );
})();
