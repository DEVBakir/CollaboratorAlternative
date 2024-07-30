// index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Log incoming requests
app.post("/log", (req, res) => {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    headers: req.headers,
    body: req.body,
  };

  console.log("Received log:", logData);

  // Save the log to a file
  const logFilePath = path.join(__dirname, "logs", `${Date.now()}.json`);
  fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));

  res.status(200).json({ message: "Log received" });
});

// Serve a page to view logs
app.get("/logs", (req, res) => {
  const logFiles = fs.readdirSync(path.join(__dirname, "logs"));
  res.json(logFiles);
});

// Serve a specific log file
app.get("/logs/:logFile", (req, res) => {
  const logFile = req.params.logFile;
  const logFilePath = path.join(__dirname, "logs", logFile);
  res.sendFile(logFilePath);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
