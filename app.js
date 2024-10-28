const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {crawlCTDT} = require('./src/modules/crawlCTDT'); // Import hàm lấy điểm
const puppeteer = require('puppeteer');
require('dotenv').config();
const { login } = require('./src/modules/loginModule');

app.get("/", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--headless",
        "--disable-gpu",
        "--window-size=1920,1080",
      ],
      headless: true,
    });

    const page = await browser.newPage();

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
    
    const navigationPromise = page.goto("https://qldt.ptit.edu.vn/#/home", { waitUntil: 'networkidle0', timeout: 60000 }); // Increase timeout
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Navigation timeout')), 30000)); // 30s timeout
    await Promise.race([navigationPromise, timeoutPromise]);

    console.log("Page loaded. Attempting to log in...");
    
    await login(page);
    
    console.log("Login attempt completed.");

    await crawlCTDT(page);
    res.send("ok");

  } catch (error) {
    console.error("Error during Puppeteer execution:", error);
    if (!res.headersSent) {
      res.status(500).send("An error occurred: " + error.message);
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.use("/api", require("./src/routers/index"));

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

