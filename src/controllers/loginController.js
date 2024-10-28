// loginController.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();
const { login } = require("../modules/loginModule"); // Import login function

// Login controller function
const loginController = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const isLogin = await login(username, password); // Ensure to pass the correct parameters
    if (isLogin) {
      console.log("Login access!");
      return res.status(200).json({ success: true, message: "Login successful!" });
    } else {
      console.log("Login failed!");
      return res.status(401).json({ success: false, message: "Login failed!" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { loginController };
