const { Router } = require('express')
const { authRouter } = require('./auth')
const { accountRouter } = require('./accounts')

const routes = Router()

routes.use('/auth', authRouter)
routes.use('/account', accountRouter)

module.exports = { routes };