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

  try {
    // Update .env file with new credentials
    const envContent = `QLDT_USERNAME=${username}\nQLDT_PASSWORD=${password}\nPORT=3000\n`;
    fs.writeFileSync(envFilePath, envContent, { encoding: 'utf8' });
    dotenv.config();
    return res.status(200).json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Error updating .env file:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { loginController };
