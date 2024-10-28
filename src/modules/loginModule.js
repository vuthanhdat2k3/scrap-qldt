require('dotenv').config();
const { crawlWithRetry, tryWithRetry } = require('./retryModule'); // Import các hàm retry

// Hàm đăng nhập
async function login(page) {
  // Wait for the username input to appear
  await page.waitForSelector("input[name='username']", { visible: true });
  
  // Now you can safely type into the username input
  await page.type("input[name='username']", process.env.QLDT_USERNAME); // Use your actual username here

  // Similarly for the password
  await page.waitForSelector("input[name='password']", { visible: true });
  await page.type("input[name='password']", process.env.QLDT_PASSWORD); // Use your actual password here

  // Click the login button
  await page.click("button[class='btn btn-primary mb-1 ng-star-inserted']"); // Adjust the selector if needed
  
  // Optionally wait for some navigation or element after logging in
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }); // Tăng timeout lên 60 giây
}

module.exports = { login };
