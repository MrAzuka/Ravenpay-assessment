const db = require("./db");
const axios = require("axios");
const https = require("https");
const agent = new https.Agent({
  family: 4,
});

const triggerWebhook = async ({ event, data }) => {
  const webhookUrl = process.env.WEBHOOK_URL;
  try {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };
    const config = {
      method: "post",
      url: webhookUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
      timeout: 50000,
      httpsAgent: agent,
    };
    await axios(config);
  } catch (error) {
    console.error("Webhook trigger failed:", error.message);
  }
};

const findNotification = async (reference) => {
  return await db("transaction_notifications")
    .where({
      reference,
    })
    .first();
};

const createNotification = async (payload) => {
  await db("transaction_notifications").insert(payload);
};
module.exports = { triggerWebhook, findNotification, createNotification };
