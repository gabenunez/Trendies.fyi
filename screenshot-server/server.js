import "dotenv/config";
import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { url } = req.body;

  if (
    req.header("internal-secret") !== process.env.SVT_INTERNAL_REQUEST_SECRET
  ) {
    return res
      .status(401)
      .json({ error: "Sorry, this is an invitation only kinda party." });
  }

  console.log("1. Trying the following URL", url);

  try {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();
    console.log("2. Browser page opened");

    // Set screen size
    await page.setViewport({ width: 1851, height: 698 });
    console.log("3. Viewport set");

    // Navigate the page to a URL
    await page.goto(url);
    console.log("4. Navigated to URL.");

    // Apply styling
    await page.addStyleTag({ content: ".rounded-lg {border-radius: 0;}" });
    console.log("5. Added styling");

    // Select graph area
    const element = await page.waitForSelector("#graph-area .recharts-wrapper");
    console.log("6. Selected graph-area element");

    const graphScreenshot = await element.screenshot();
    console.log("7. screenshot taken");

    const base64Image = Buffer.from(graphScreenshot).toString("base64");
    console.log("8. Screenshoy converted to base64");

    await browser.close();
    console.log("9. browser closed");

    return res.json({ image: base64Image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch image." });
  }
});

const port = process.env.PORT || 1818;

app.listen(port, () =>
  console.log(`Screenshot server listening on port ${port}`)
);
