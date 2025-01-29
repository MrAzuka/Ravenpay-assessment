const { Router } = require('express')
const { authRouter } = require('./auth')
const { accountRouter } = require('./accounts')
const { transactionRouter } = require('./transaction')
const { webhookRouter } = require('./webhook')

const routes = Router()

routes.use('/auth', authRouter)
routes.use('/account', accountRouter)
routes.use('/transaction', transactionRouter)
routes.use('/webhook', webhookRouter)

module.exports = { routes };