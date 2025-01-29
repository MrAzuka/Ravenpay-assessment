const axios = require("axios");
const db = require("../models/db");
const qs = require("qs")

const {
    findBankAccountByUser,
    createBankAccount,
} = require("../models/bank_account");


const generateBankAccount = async (req, res) => {
    try {
        const userId = req.body.user.user_id;

        // Check if user already has a bank account
        const checkIfAccountExist = await findBankAccountByUser({ user_id: userId });

        if (checkIfAccountExist) {
            return res.status(400).json({ success: false, message: "User already has a bank account" })
        }

        // Generate a account number using Raven Atlas API
        const { first_name, last_name, phone, email } = req.body;
        if (!first_name || !last_name || !phone || !email) {
            return res.status(400).json({ success: false, message: "Missing details" })
        }

        let newAccount;

        // Prepare request data
        const data = qs.stringify({
            first_name,
            last_name,
            phone,
            email,
            amount: "100",
        });

        const config = {
            method: "post",
            url: process.env.RAVEN_ATLAS_GENERATE_ACCOUNT_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${process.env.RAVEN_ATLAS_API_KEY}`,
            },
            data: data,
        };

        // Make the API request
        const response = await axios(config)
        newAccount = {
            user_id: userId,
            account_number: response.data.data.account_number,
            account_name: response.data.data.account_name,
            bank: response.data.data.bank,
            amount: response.data.data.amount,
            is_permanent: response.data.is_permanent,
            balance: 0.0,
        };

        // Create a new bank account

        await createBankAccount(newAccount);

        // Respond with the created account details
        return res.status(201).json({ success: true, message: "Bank account generated." })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error with request: " + error })
    }
};

module.exports = { generateBankAccount };
