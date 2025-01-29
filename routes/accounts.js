const { Router } = require('express')
const { generateBankAccount, retrieveBankAccount } = require('../controller/accounts')
const { verifyJwtToken } = require('../middlewares/auth')


const accountRouter = Router();

accountRouter.post("/generate", verifyJwtToken, generateBankAccount);
accountRouter.get('/', verifyJwtToken, retrieveBankAccount)


module.exports = { accountRouter }