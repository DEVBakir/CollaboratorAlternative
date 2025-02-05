// index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");
const { log } = require("console");

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Log incoming requests
app.post("/log", (req, res) => {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    headers: req.headers,
    body: req.body,
  };

  // Save the log to a file
  const logFilePath = path.join(__dirname, "logs", `${Date.now()}.json`);
  fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));

  res.status(200).json({ message: "Log received" });
});

app.get("/logs", (req, res) => {
  const logFiles = fs.readdirSync(path.join(__dirname, "logs"));
  let html = `
    <html>
      <head>
        <title>Log Viewer</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            color: #333;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin: 5px 0;
          }
          a {
            text-decoration: none;
            color: #0066cc;
          }
          a:hover {
            text-decoration: underline;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Log Viewer</h1>
          <ul>
  `;
  logFiles.forEach((file) => {
    html += `<li><a href="/logs/${file}">${file}</a></li>`;
  });
  html += `
          </ul>
        </div>
      </body>
    </html>
  `;
  console.log(html);
  res.send(html);
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

app.delete("/clear-logs", (req, res) => {
  const logsDir = path.join(__dirname, "logs");
  try {
    const logFiles = fs.readdirSync(logsDir);

    logFiles.forEach((file) => {
      fs.unlinkSync(path.join(logsDir, file));
    });

    res.status(200).json({ message: "All logs have been cleared." });
  } catch (error) {
    console.error("Error clearing logs:", error);
    res.status(500).json({ message: "Failed to clear logs." });
  }
});
