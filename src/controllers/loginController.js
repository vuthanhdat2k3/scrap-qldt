// loginController.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const envFilePath = path.resolve(__dirname, '../../.env');

// Login controller function
const loginController = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  return username, password;
    
};

module.exports = { loginController };
