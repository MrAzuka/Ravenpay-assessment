const jwt = require("jsonwebtoken");


exports.createToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
    return token;
};
exports.verifyToken = (token) => {
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    return isValid;
};