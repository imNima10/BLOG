const { errorResponse } = require("../helpers/responses")
const User = require("../models/user")
let configs = require("./../configs")
let JWT = require("jsonwebtoken")

exports.createAccessToken = async (user) => {
    try {
        let token = await JWT.sign({ id: user._id }, configs.auth.token.accessToken.secretKey, {
            expiresIn: configs.auth.token.accessToken.expire + "m"
        })
        return {
            success: true,
            token
        }
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Failed to create access token",
            data: error.message
        };
    }
}
exports.createRefreshToken = async (user) => {
    try {
        let token = await JWT.sign({ id: user._id }, configs.auth.token.refreshToken.secretKey, {
            expiresIn: configs.auth.token.refreshToken.expire + "d"
        })
        return {
            success: true,
            token
        }
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Failed to create refresh token",
            data: error.message
        };
    }
}
exports.verifyAccessToken = async (token) => {
    try {
        let payload = await JWT.verify(token, configs.auth.token.accessToken.secretKey)
        let isUserExists = await User.findById(payload.id)
        if (!isUserExists) {
            throw new Error("User not found")
        }
        return {
            success: true,
            user: isUserExists
        }
    } catch (error) {
        return {
            success: false,
            status: 401,
            message: "Access token verification failed",
            data: error.message
        };
    }
}
exports.verifyRefreshToken = async (token) => {
    try {
        let payload = await JWT.verify(token, configs.auth.token.refreshToken.secretKey)
        let isUserExists = await User.findById(payload.id)
        if (!isUserExists) {
            throw new Error("Authentication failed. User no longer exists");
        }
        return {
            success: true,
            user: isUserExists
        }
    } catch (error) {
        return {
            success: false,
            status: 401,
            message: "Refresh token verification failed",
            data: error.message
        };
    }
}