const User = require("../models/user");
let { verifyAccessToken } = require("../utils/token");

exports.authGuard = async (req, res, next) => {
    try {
        let accessToken = req.cookies["access-token"];

        if (!accessToken) {
            throw new Error("User not found");
        }

        let result = await verifyAccessToken(accessToken);
        if (!result.success) {
            throw new Error("Invalid or expired access token");
        }

        let user = await User.findById(result.user._id)
        if (!user) {
            throw new Error("User not Found, please login again");
        }

        req.user = user
        req.isAdmin = user.role == "ADMIN" ? true : false
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
