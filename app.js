
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
        "--disable-dev-shm-usage", // Overcome limited resource problems
        "--headless", // Ensure Chrome runs in headless mode
        "--disable-gpu" // Disable GPU hardware acceleration
      ],
      headless: true, // Ensure headless mode
    });

    const page = await browser.newPage();
    await page.goto("https://qldt.ptit.edu.vn/#/home", { waitUntil: 'networkidle2', timeout: 60000 });
    await login(page);

    res.send("ok");

    await browser.close();
  } catch (error) {
    console.error("Error launching Puppeteer:", error);
    res.status(500).send("An error occurred");
  }
});
app.use("/api", require("./src/routers/index"));

// Bắt đầu server
app.listen(process.env.PORT || 3000, () => {
  console.log("starting....");
});
