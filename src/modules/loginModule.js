// loginModule.js
async function login(page) {
  try {
    await page.waitForSelector("input[name='username']", { visible: true, timeout: 60000 });
    await page.type("input[name='username']", process.env.QLDT_USERNAME);

    await page.waitForSelector("input[name='password']", { visible: true, timeout: 60000 });
    await page.type("input[name='password']", process.env.QLDT_PASSWORD);

    await page.click("button[class='btn btn-primary mb-1 ng-star-inserted']");

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }); // Use networkidle0
  } catch (error) {
    console.error("Login error:", error);
    throw error; 
  }
}

module.exports = { login };
