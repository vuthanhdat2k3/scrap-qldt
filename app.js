// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const puppeteer = require('puppeteer');

let browser;

// Hàm khởi động Puppeteer
const startBrowser = async () => {
    browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

// Route đơn giản
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.use("/api", require("./src/routers/index"));

// Bắt đầu server
app.listen(PORT, async () => {
    await startBrowser(); // Khởi động browser trước khi server chạy
    console.log(`Server running on port ${PORT}`);
});
