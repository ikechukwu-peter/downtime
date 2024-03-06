const axios = require("axios");

const checkURLStatus = async (url) => {
  try {
    const response = await axios.head(url);
    const statusCode = response.status;
    const isAccessible = statusCode >= 200 && statusCode < 400;
    return { statusCode, isAccessible };
  } catch (error) {
    return { statusCode: 0, isAccessible: false };
  }
};

// Determine URL status based on status code
const getStatus = (statusCode) => {
  return statusCode >= 200 && statusCode < 300 ? "up" : "down";
};

module.exports = { checkURLStatus, getStatus };
