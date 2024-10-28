// loginModule.js
async function login(page) {
  try {
    // Wait for and enter username
    await page.waitForSelector("input[name='username']", { visible: true, timeout: 60000 });
    await page.type("input[name='username']", process.env.QLDT_USERNAME);

    // Wait for and enter password
    await page.waitForSelector("input[name='password']", { visible: true, timeout: 60000 });
    await page.type("input[name='password']", process.env.QLDT_PASSWORD);

    // Click the login button
    await page.click("button[class='btn btn-primary mb-1 ng-star-inserted']");

    // Wait for navigation or check for a specific element indicating login success
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

    return true;
    
  } catch (error) {
    console.error("Login error:", error);
    return false; // Return false if login fails
  }
}

module.exports = { login };
