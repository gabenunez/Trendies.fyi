import "dotenv/config";
import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { url } = req.body;

  try {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(url);

    // Set screen size
    await page.setViewport({ width: 1830, height: 830 });

    // Select graph area
    const element = await page.waitForSelector("#graph-area");

    const graphScreenshot = await element.screenshot();
    const base64Image = Buffer.from(graphScreenshot).toString("base64");

    await browser.close();

    return res.json({ image: base64Image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch image." });
  }
});

const port = process.env.PORT || 1818;

app.listen(port, () => console.log(`Listening on port ${port}`));
