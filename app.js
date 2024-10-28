// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const puppeteer = require('puppeteer');


app.get("/", async (req, res) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("https://example.com");
  const text = await page.$eval("h1", (el) => el.textContent);
  res.send(text);

  await browser.close();
});
// app.use("/api", require("./src/routers/index"));

// Bắt đầu server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});
