const { Router } = require('express')
const { register, login } = require('../controller/authentication')


const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);

module.exports = { authRouter }