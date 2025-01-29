const axios = require("axios");
const qs = require("qs");
const db = require("../models/db");
const { triggerWebhook } = require("../models/webhook");
const {
    findBankAccountByUser,
    updateBankAccount,
} = require("../models/bank_account");
const { findTransactionsByUserId, createTransaction } = require("../models/transactions");

const transferBetweenBanks = async (req, res) => {
    const userId = req.body.user.user_id;
    const { recipient_bank, recipient_account, amount } = req.body;


    try {
        // Validate input
        if (!recipient_bank || !recipient_account || !amount || amount <= 0) {
            return res.status(400).json({ status: false, message: "Missing Details" })
        }

        // Ensure the user has sufficient balance
        const userAccount = await findBankAccountByUser({ user_id: userId });
        if (!userAccount || userAccount.balance < amount) {
            return res.status(400).json({ status: false, message: "Insufficient balance." })
        }

        const data = qs.stringify({
            amount: amount,
            bank: recipient_bank,
            account_number: recipient_account,
            account_name: userAccount.account_name,
            bank_code: "044",
            narration: "Transfer",
            reference: "9967998",
            currency: "NGN",
        });

        const config = {
            method: "post",
            url: process.env.RAVEN_ATLAS_TRANSFER_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${process.env.RAVEN_ATLAS_API_KEY}`,
            },
            data: data,
        };

        const response = await axios(config);

        // Log the transaction
        const newTransaction = {
            user_id: userId,
            account_id: userAccount.act_id,
            narration: response.data.data.narration,
            amount: response.data.data.amount,
            reference: response.data.data.trx_ref,
            status: response.data.status || "pending",
            recipient_bank: response.data.data.bank,
            recipient_account: response.data.data.account_number,
        };

        const [transactionId] = await createTransaction(newTransaction);

        // Deduct the balance from the sender's account
        await updateBankAccount(userId, { balance: userAccount.balance - amount });

        // Trigger webhook
        await triggerWebhook({
            event: "transfer",
            data: {
                transactionId,
                ...newTransaction,
            },
        });

        // Respond with success
        res.status(201).json({
            status: true,
            message: "Transfer successful.",
            data: { id: transactionId, ...newTransaction },
        });
    } catch (error) {
        console.error("Transfer error:", error.message);
        // Trigger webhook for failed transfer
        await triggerWebhook({
            event: "transfer_failed",
            data: {
                userId,
                recipient_bank,
                recipient_account,
                amount,
                error: error.message,
            },
        });

        return res.status(500).json({ status: false, message: "Error with request: " + error })
    }
};

const getAllTransactions = async (req, res) => {
    const userId = req.body.user.user_id;

    try {
        // Query transactions for the authenticated user
        const transactions = await findTransactionsByUserId(userId);

        if (!transactions.length) {
            return res.status(404).json({ status: false, message: "No transactions found." });
        }

        return res.status(200).json({
            status: true,
            message: "Transactions fetched successfully.",
            transactions,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Failed to fetch transactions." });
    }
};

const getTransactionsByType = async (req, res) => {
    const userId = req.body.user.user_id;
    const { type } = req.params; // `deposit` or `transfer`

    try {
        // Validate the transaction type
        if (!["deposit", "transfer"].includes(type)) {
            return res.status(400).json({ status: false, message: "Invalid transaction type." });
        }

        // Query transactions of a specific type
        const transactions = await findTransactionsByUserId(userId, type);

        if (!transactions.length) {
            return res.status(404).json({
                status: false,
                message: `No ${type} transactions found.`,
            });
        }

        return res.status(200).json({
            status: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)
                } transactions retrieved successfully.`,
            data: transactions,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Failed to retrieve transactions." });
    }
};

module.exports = {
    transferBetweenBanks,
    getAllTransactions,
    getTransactionsByType,
};
