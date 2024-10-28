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
        "--disable-gpu"
      ],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto("https://qldt.ptit.edu.vn/#/home", { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Optional: Log page content for debugging
    const content = await page.content();
    console.log(content); 

    await login(page);
    
    res.send("ok");

    await browser.close();
  } catch (error) {
    console.error("Error launching Puppeteer:", error);
    res.status(500).send("An error occurred");
  }
});

app.use("/api", require("./src/routers/index"));

app.listen(process.env.PORT || 3000, () => {
  console.log("starting....");
});
