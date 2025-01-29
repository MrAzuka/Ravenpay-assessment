const { Router } = require('express')
const { generateBankAccount } = require('../controller/accounts')
const { verifyJwtToken } = require('../middlewares/auth')


const accountRouter = Router();

accountRouter.post("/generate", verifyJwtToken, generateBankAccount);


module.exports = { accountRouter }