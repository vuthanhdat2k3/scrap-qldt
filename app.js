// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;;

// Route đơn giản
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
app.use("/api", require("./src/routers/index"))

// Bắt đầu server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});