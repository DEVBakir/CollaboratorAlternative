// index.js
const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle POST requests
app.post("/api/data", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);

  res
    .status(200)
    .json({ message: "Data received successfully", receivedData: data });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
