const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(
  "/",
  createProxyMiddleware({
    target: "https://apiconnect.angelbroking.com",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // remove /api from the URL
    },
  })
);

app.post("/api/sendTelegram", async (req, res) => {
  const { message, chatId } = req.body;
  const botToken = "6726361729";

  if (!botToken) {
    return res.status(500).json({ error: "Bot token not configured" });
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      { chat_id: chatId, text: message }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/send-telegram", (req, res) => {
  console.log("Received request:", req.body);
  res.json({ message: "Endpoint reached successfully" });
});

function createTelegramMessage(data) {
  const message = `
🏦 Stock Update: ${data.tradingsymbol} (${data.exchange})

Symbol Token: ${data.symboltoken}

📊 Price Information:
- Open: ₹${data.open.toFixed(2)}
- High: ₹${data.high.toFixed(2)}
- Low: ₹${data.low.toFixed(2)}
- Close: ₹${data.close.toFixed(2)}
- LTP: ₹${data.ltp.toFixed(2)}

📈 Change: ₹${(data.ltp - data.close).toFixed(2)} (${(
    ((data.ltp - data.close) / data.close) *
    100
  ).toFixed(2)}%)

Last Updated: ${new Date().toLocaleString()}
`;

  return message.trim();
}

const sendTelegramMsg = async (stockData) => {
  const telegramMessage = createTelegramMessage(stockData);
  console.log("telegramMessage", telegramMessage);
  const url =
    "https://api.telegram.org/bot6726361729:AAGoOOogoGMuVQVzKSGjsG3JNqMU-qkBRLY/sendMessage";

  const requestBody = {
    chat_id: "-1002182893977",
    text: telegramMessage,
  };

  try {
    const response = await axios.post(url, requestBody, {});
    console.log("🚀 ~ fetchData ~ response: send msg", response);
    return response.data;
  } catch (error) {
    console.error("Error config:", JSON.stringify(error.config, null, 2));
    return null;
  }
};

const fetchData = async () => {
  const url =
    "https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getLtpData";

  const requestBody = {
    exchange: "NSE",
    tradingsymbol: "SBIN-EQ",
    symboltoken: "3045",
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-UserType": "USER",
    "X-SourceID": "WEB",
    "X-Clientlocalip": "192.168.1.1",
    "X-Clientpublicip": "110.227.207.99",
    "X-Macaddress": "00:00:00:00:00:00",
    "X-Privatekey": "7sKm3pz3",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkcxNDkyODEiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlYM1I1Y0dVaU9pSmpiR2xsYm5RaUxDSjBiMnRsYmw5MGVYQmxJam9pZEhKaFpHVmZZV05qWlhOelgzUnZhMlZ1SWl3aVoyMWZhV1FpT2pFeExDSnpiM1Z5WTJVaU9pSXpJaXdpWkdWMmFXTmxYMmxrSWpvaU0yTmlNMlF6TkRJdFpqTmtNaTB6TUROaExUZ3pZV010TVdNNE5qSmhaamszTjJVNUlpd2lhMmxrSWpvaWRISmhaR1ZmYTJWNVgzWXhJaXdpYjIxdVpXMWhibUZuWlhKcFpDSTZNVEVzSW5CeWIyUjFZM1J6SWpwN0ltUmxiV0YwSWpwN0luTjBZWFIxY3lJNkltRmpkR2wyWlNKOWZTd2lhWE56SWpvaWRISmhaR1ZmYkc5bmFXNWZjMlZ5ZG1salpTSXNJbk4xWWlJNklrY3hORGt5T0RFaUxDSmxlSEFpT2pFM01qRXdNamszTXpRc0ltNWlaaUk2TVRjeU1Ea3pOemcyTVN3aWFXRjBJam94TnpJd09UTTNPRFl4TENKcWRHa2lPaUpoTXpJNE5XSm1ZeTAxTlRVM0xUUTJPVGN0T0RKaU5pMWpPVFU0TldZNE56QXpOVGNpZlEubWJMT3N0cGdoWmVjcFEwUUI3ZG40NHlTMGYxYzNGbjU3Uk05N1VZcjliV0dBam96RVRUZGlpUG4wd2wtODRHRTNXT1gycE0xcVctdmNlMUduRzN5YVh0R2hMVE1sQlhFdDBseXExX3lxUnRLM1RaRnRFVGhHWGFkUnpENGJLNFBzd01ZYVFlSlBmaTk3b0NlZDc4ZTlsUDluVHlaMWFPd05iNkE1MlhpTlFBIiwiQVBJLUtFWSI6IjdzS20zcHozIiwiaWF0IjoxNzIwOTM3OTIxLCJleHAiOjE3MjEwMjk3MzR9.a-GxhFKMhjleGjxXbBbmDabxsfx5KaFzQCFscxby7ejsNgnLWZDr7AgV352236UbkpWIC8CXyWSu9yevDFg-_Q",
  };

  try {
    const response = await axios.post(url, requestBody, { headers });
    await sendTelegramMsg(response?.data?.data);
    console.log("🚀 ~ fetchData ~ response:", response?.data?.data);
    return response.data;
  } catch (error) {
    console.error("Error config:", JSON.stringify(error.config, null, 2));
    return null;
  }
};

// Route to manually trigger data fetch
app.get("/fetch-data", async (req, res) => {
  const data = await fetchData();
  if (data) {
    console.log("🚀 ~ app.get ~ data:", data);
    res.json(data);
  } else {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Function to run every 15 seconds
const runEvery15Seconds = async () => {
  console.log("Running scheduled task to fetch data");
  await fetchData();
};

// Set up interval to run every 15 seconds
// setInterval(runEvery15Seconds, 15000);

app.listen(3001, () => {
  console.log("Proxy server is running on port 3001");
});
