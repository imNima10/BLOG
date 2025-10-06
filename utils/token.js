const { errorResponse } = require("../helpers/responses")
const User = require("../models/user")
let configs = require("./../configs")
let JWT = require("jsonwebtoken")

exports.createAccessToken = async (user) => {
    try {
        let token = await JWT.sign({ id: user._id }, configs.auth.token.accessToken.secretKey, {
            expiresIn: configs.auth.token.accessToken.expire + "s"
        })
        return token
    } catch (error) {
        throw error
    }
}
exports.createRefreshToken = async (user) => {
    try {
        let token = await JWT.sign({ id: user._id }, configs.auth.token.refreshToken.secretKey, {
            expiresIn: configs.auth.token.refreshToken.expire + "s"
        })
        return token
    } catch (error) {
        throw error
    }
}
exports.verifyAccessToken = async (token) => {
    try {
        let payload = await JWT.verify(token, configs.auth.token.accessToken.secretKey)
        let isUserExists = await User.findById(payload.id)
        if (!isUserExists) {
            throw new Error("User Not Found")
        }
        return isUserExists
    } catch (error) {
        throw new Error(`Access token verification failed: ${error.message}`);
    }
}
exports.verifyRefreshToken = async (token) => {
    try {
        let payload = await JWT.verify(token, configs.auth.token.refreshToken.secretKey)
        let isUserExists = await User.findById(payload.id)
        if (!isUserExists) {
            throw new Error("User Not Found")
        }
        return isUserExists
    } catch (error) {
        throw new Error(`Refresh token verification failed: ${error.message}`);
    }
}