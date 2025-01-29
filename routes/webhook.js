const { Router } = require('express')
const { handleWebhook } = require('../controller/webhook')


const webhookRouter = Router();

webhookRouter.post("/", handleWebhook);


module.exports = { webhookRouter }