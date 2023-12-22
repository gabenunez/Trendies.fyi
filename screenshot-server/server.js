import "dotenv/config";
import express from "express";
import captureWebsite from "capture-website";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { url } = req.body;

  try {
    const base64Image = await captureWebsite.base64(url, {
      waitForElement: "#graph-area",
      element: "#graph-area",
      timeout: 5,
      styles: [".rounded-lg {border-radius: 0;}"],
    });

    return res.json(base64Image);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch image." });
  }
});

const port = process.env.PORT || 1818;

app.listen(port, () => console.log(`Listening on port ${port}`));
