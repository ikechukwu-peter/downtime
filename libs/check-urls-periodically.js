const cron = require("node-cron");
const { getStatus, checkURLStatus } = require("../utils/check-url-status");

const checkURLsPeriodically = (systems) => {
  cron.schedule("* * * * *", async () => {
    console.log("running a task every minute");
    // Loop through systems array and check status for each URL
    for (const system of systems) {
      const { statusCode } = await checkURLStatus(system.url);
      const status = getStatus(statusCode);

      // Update status in systems array
      system.statusCode = statusCode;
      system.status = status;
      system.lastChecked = new Date().toISOString();
    }
  });
};

module.exports = { checkURLsPeriodically };
