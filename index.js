const express = require("express");
const { formatURL } = require("./utils/format-url");
const { checkURLStatus, getStatus } = require("./utils/check-url-status");
const { checkURLsPeriodically } = require("./libs/check-urls-periodically");

const app = express();

// Set view engine
app.set("view engine", "ejs");
app.use(express.json({ limit: "10kb" }));

const systems = [];

app.get("/", (req, res) => {
  res.render("status", { systems });
});

app.post("/create", async (req, res) => {
  console.log(req.body);
  if (!req.body.url)
    return res
      .status(400)
      .json({ status: "fail", error: "url is a required field" });

  const { url } = req.body;

  const trimmedURL = url.trim();

  // format the url
  const formattedURL = formatURL(trimmedURL);

  // check URL status
  const { statusCode, isAccessible } = await checkURLStatus(formattedURL);

  if (!isAccessible)
    return res.status(400).json({
      status: "fail",
      error: "URL is not accessible or invalid",
    });

  let status = getStatus(statusCode);

  // Add URL entry to the system array
  systems.push({
    url: formattedURL,
    id: systems.length + 1,
    lastChecked: new Date().toISOString(),
    statusCode,
    status,
  });

  console.log({ systems });

  res.status(200).json({
    status: "success",
    message: `${formattedURL} added successfully`,
  });
});

checkURLsPeriodically(systems);

// Start the Server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
