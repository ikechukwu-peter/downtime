const express = require("express");
const { formatURL } = require("./utils/format-url");
const { getStatus, checkURLStatus } = require("./utils/check-url-status");
const { checkURLsPeriodically } = require("./libs/check-urls-periodically");

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.use(express.json({ limit: "10kb" }));

// Sample system status data
const systems = [];

// Define route handler
app.get("/", (req, res) => {
  res.render("status", { systems });
});

app.post("/create", async (req, res) => {
  if (!req.body?.url)
    return res
      .status(400)
      .json({ status: "fail", error: "url is a required field" });

  const { url } = req.body;

  const trimmedURL = url.trim();

  const formattedURL = formatURL(trimmedURL);

  // Check URL status
  const { statusCode, isAccessible } = await checkURLStatus(formattedURL);

  if (!isAccessible)
    return res.status(400).json({
      status: "fail",
      error: "URL is not accessible or is invalid",
    });

  let status = getStatus(statusCode);

  // Add URL entry to systems array
  systems.push({
    url: formattedURL,
    id: systems.length + 1,
    lastChecked: new Date().toISOString(),
    statusCode: statusCode,
    status: status,
  });

  res.status(200).send(`${formattedURL} added successfully`);
});

// Start checking URLs periodically
checkURLsPeriodically(systems);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
