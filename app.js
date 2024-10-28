const express = require('express');
const Queue = require('bull');
const puppeteer = require('puppeteer');
const { login } = require('./src/modules/loginModule');

const app = express();
const PORT = process.env.PORT || 3000;

// Create a Bull queue
const puppeteerQueue = new Queue('puppeteer tasks');

// Process the queue
puppeteerQueue.process(async (job) => {
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
    await page.goto("https://qldt.ptit.edu.vn/#/home", { waitUntil: 'networkidle2', timeout: 60000 }); // Increased timeout

    console.log("Page loaded. Attempting to log in...");
    await login(page);
    console.log("Login attempt completed.");

    // You can return any relevant data from the job
    return { success: true };

  } catch (error) {
    console.error("Error during Puppeteer execution:", error);
    throw error; // Throw error to handle it in the queue
  } finally {
    // Ensure the browser closes in all cases
    if (browser) {
      await browser.close();
    }
  }
});

// Endpoint to start the Puppeteer task
app.get("/", async (req, res) => {
  // Add job to the queue
  const job = await puppeteerQueue.add();

  // Respond immediately to the client
  res.send("Task is being processed. Job ID: " + job.id);
});

// app.use("/api", require("./src/routers/index"));

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
