const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const puppeteer = require('puppeteer');
const { login } = require('./src/modules/loginModule');

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--headless",
        "--disable-gpu",
        "--window-size=1920,1080"
      ],
      headless: true,
    });

    const page = await browser.newPage();
    
    // Optional: Intercept requests to block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', request => {
      const resourceType = request.resourceType();
      if (['image', 'media', 'font'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    console.log("Navigating to the page...");
    await page.goto("https://qldt.ptit.edu.vn/#/home", { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log("Page loaded. Attempting to log in...");
    await login(page);
    
    console.log("Login attempt completed.");
    res.send("ok");

    await browser.close();
  } catch (error) {
    console.error("Error during Puppeteer execution:", error);
    res.status(500).send("An error occurred: " + error.message);
  }
});

app.use("/api", require("./src/routers/index"));

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
