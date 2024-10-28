const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {crawlCTDT} = require('./src/modules/crawlCTDT'); // Import hàm lấy điểm
const puppeteer = require('puppeteer');
require('dotenv').config();
const { login } = require('./src/modules/loginModule');

app.get("/", async (req, res) => {
  res.send("Hello");
});

app.use("/api", require("./src/routers/index"));

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

