const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Construct the path to the .env file
const envFilePath = path.resolve(__dirname, '../../.env');

// Login controller function
const loginController = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    // Log the current path of the .env file
    console.log('Attempting to read .env file at:', envFilePath);

    // Read the current content of the .env file
    const envContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });

    // Update the content with the new username and password
    const updatedContent = envContent
      .split('\n')
      .map(line => {
        if (line.startsWith('QLDT_USERNAME=')) {
          return `QLDT_USERNAME=${username.trim()}`; // Remove spaces
        }
        if (line.startsWith('QLDT_PASSWORD=')) {
          return `QLDT_PASSWORD=${password.trim()}`; // Remove spaces
        }
        return line; // Return the line unchanged if it's not one of the keys we're updating
      })
      .join('\n');

    // Write the updated content back to the .env file
    fs.writeFileSync(envFilePath, updatedContent, { encoding: 'utf8' });
    console.log('Updated .env file content:', updatedContent);

    // Reload the environment variables
    dotenv.config(); // Re-load the environment variables

    // Optionally, log the new environment variables
    console.log('New QLDT_USERNAME:', process.env.QLDT_USERNAME);
    console.log('New QLDT_PASSWORD:', process.env.QLDT_PASSWORD);

    // Respond with success
    return res.status(200).json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Error updating .env file:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { loginController };
