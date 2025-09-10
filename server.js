const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/price/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  const url = `https://sarmaaya.pk/stocks/${symbol}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("div.pb-1.text-lg.font-bold.md\\:text-2xl");
    const price = await page.evaluate(() => {
      const el = document.querySelector("div.pb-1.text-lg.font-bold.md\\:text-2xl");
      return el ? el.innerText.trim() : null;
    });

    await browser.close();
    res.json({ symbol, price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
