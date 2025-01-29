const db = require("../models/db");
const { findNotification, createNotification } = require("../models/webhook");

const handleWebhook = async (req, res) => {
    try {
        const { event, data } = req.body;

        if (!event || !data) {
            return res.status(400).json({ success: false, message: "Missing details" })
        }

        if (event === "transfer") {
            const { reference } = data;

            // Check for existing notification
            const existingNotification = await findNotification(reference);
            if (existingNotification) {
                return res
                    .status(409)
                    .json({ status: false, message: "Notification already exists." });
            }

            // Create a new notification
            await createNotification({
                event,
                ...data,
            });
        } else {
            await createNotification({
                event,
                ...data,
            });
        }

        // Respond with a success message
        return res.status(201).json({ status: true, message: "Webhook processed successfully." });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Error with request: " + error });
    }
};

module.exports = { handleWebhook };
