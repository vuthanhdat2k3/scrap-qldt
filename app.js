const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const puppeteer = require('puppeteer');
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
    
    await page.goto("https://qldt.ptit.edu.vn/#/home", { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log("Page loaded. Attempting to log in...");
    await login(page);
    
    console.log("Login attempt completed.");
    
    // Send response only if everything is successful
    res.send("ok");

  } catch (error) {
    console.error("Error during Puppeteer execution:", error);
    // Send error response only if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).send("An error occurred: " + error.message);
    }
  } finally {
    // Ensure the browser closes in all cases
    if (browser) {
      await browser.close();
    }
  }
});

app.use("/api", require("./src/routers/index"));

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
