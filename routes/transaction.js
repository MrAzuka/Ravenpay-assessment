const { Router } = require('express')
const { getAllTransactions, getTransactionsByType, transferBetweenBanks } = require('../controller/transactions')
const { verifyJwtToken } = require('../middlewares/auth')

const transactionRouter = Router();

transactionRouter.post("/transfer", verifyJwtToken, transferBetweenBanks);
transactionRouter.get("/history/all", verifyJwtToken, getAllTransactions);
transactionRouter.get("/history/type", verifyJwtToken, getTransactionsByType);

module.exports = { transactionRouter }