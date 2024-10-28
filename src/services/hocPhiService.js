// puppeteerController.js
const pt = require('puppeteer');
const minimal_args = require("../constant/minimalArgs");
require('dotenv').config();

// Import các module cần thiết
const { login } = require('../modules/loginModule'); // Import hàm đăng nhập
const {crawlXemHocPhi} = require('../modules/crawlXemHocPhi'); // Import hàm lấy điểm

// Khởi tạo browser và thực hiện các thao tác
async function crawlHocPhi() {
  const browser = await pt.launch({
    headless: false,
    args: minimal_args,
    userDataDir: './path/to/cache/resource', // cache tài nguyên
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 800 });

  // Chặn các tài nguyên không cần thiết như ảnh, font, media, stylesheet
  await page.setRequestInterception(true);
  page.on('request', request => {
    const resourceType = request.resourceType();
    if (['image', 'media'].includes(resourceType)) {
      request.abort(); // Chặn các tài nguyên không cần thiết
    } else {
      request.continue();
    }
  });

  // Launch URL
  await page.goto('https://qldt.ptit.edu.vn/#/home', { waitUntil: 'networkidle2', timeout: 60000 });

  // Gọi hàm đăng nhập từ module loginModule
  const isLogin = await login(page);

  // Gọi hàm để lấy điểm
  if(isLogin) await crawlXemHocPhi(page); // Gọi hàm từ module lấy điểm
  else{ console.log("failed!");}

  // Close the browser
  await browser.close();
}

// Xuất hàm để sử dụng ở nơi khác
module.exports = {
  crawlHocPhi,
};
