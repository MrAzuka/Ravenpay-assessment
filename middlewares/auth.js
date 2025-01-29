const { verifyToken } = require("../utils/jsonwebtoken");

exports.verifyJwtToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        // Check if the Authorization header exists
        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: "Authentication is required",
            });
        }

        // Check if the token is a Bearer token
        if (!authorization.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Please use a Bearer token",
            });
        }

        // Extract the token
        const token = authorization.split(" ")[1];

        // If verification fails, return an error
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied",
            });
        }

        // Verify the token
        const verifyNewToken = verifyToken(token);

        // Attach the decoded token (user info) to the request object
        req.body.user = verifyNewToken;

        // Proceed to the next middleware
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred",
        });
    }
};
