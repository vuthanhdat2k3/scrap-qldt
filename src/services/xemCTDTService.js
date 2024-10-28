// puppeteerController.js
const pt = require("puppeteer");
const minimal_args = require("../constant/minimalArgs");
require("dotenv").config();

// Import các module cần thiết
const { login } = require("../modules/loginModule"); // Import hàm đăng nhập
const { crawlCTDT } = require("../modules/crawlCTDT"); // Import hàm lấy điểm

// Khởi tạo browser và thực hiện các thao tác
async function crawlXemCTDT() {
  let broswer;
  try{
    broswer = await pt.launch({
      headless: true,
      args: minimal_args,
      userDataDir: "./path/to/cache/resource", // cache tài nguyên
    });
  
    const page = await broswer.newPage();
  
    // Chặn các tài nguyên không cần thiết như ảnh, font, media, stylesheet
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "media", "font"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
    console.log("Navigating to the page...");
  
    const navigationPromise = page.goto("https://qldt.ptit.edu.vn/#/home", {
      waitUntil: "networkidle0",
      timeout: 60000,
    }); // Increase timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Navigation timeout")), 30000)
    ); // 30s timeout
    await Promise.race([navigationPromise, timeoutPromise]);
  
    console.log("Page loaded. Attempting to log in...");
  
    await login(page);
    await crawlCTDT(page); // Proceed to crawl if login succeeds
    
  }catch (error) {
      console.error("Error during Puppeteer execution:", error);
    } finally {
      if (broswer) {
        await broswer.close();
      }
    }
}

// Xuất hàm để sử dụng ở nơi khác
module.exports = {
  crawlXemCTDT,
};
