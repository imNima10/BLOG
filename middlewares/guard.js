const User = require("../models/user");
let { verifyAccessToken } = require("../utils/token");

exports.authGuard = async (req, res, next) => {
    try {
        let accessToken = req.cookies["access-token"];
        
        if (!accessToken) {
            throw new Error("Access token not found");
        }

        let payload = await verifyAccessToken(accessToken);
        if (!payload._id) {
            throw new Error("Invalid or expired access token");
        }

        let user = await User.findById(payload._id)
        if (!user) {
            throw new Error("User not Found, please login again");
        }

        req.user = user
        return next();
    } catch (error) {
        next({
            message: "Unauthorized access",
            status: 401,
            data: error.message || "Token verification failed"
        });
    }
};

exports.roleGuard = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error("Access denied");
        }
        let user = req.user
        if (user.role != "ADMIN") {
            throw new Error("This router is protected, and you don't have access");
        }
        return next()
    } catch (error) {
        next({
            message: "Forbidden access",
            status: 403,
            data: error.message || "Role verification failed"
        });
    }
};
