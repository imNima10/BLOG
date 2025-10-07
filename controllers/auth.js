const { successResponse, errorResponse } = require("../helpers/responses")
const { createAccessToken, createRefreshToken } = require("../utils/token")
let User = require("../models/user")
let redis = require("../db/redis")
const configs = require("../configs")

exports.getLogin = async (req, res, next) => {
    return res.render("login")
}

exports.login = async (req, res, next) => {
    try {
        let user = req.user

        if (!user) {
            return errorResponse(res, 400, { msg: "User information is missing" })
        }

        let existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
            return errorResponse(res, 401, { msg: "User not found, please login again" })
        }

        let accessToken = await createAccessToken(existingUser)
        let refreshToken = await createRefreshToken(existingUser)

        res.cookie("access-token", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: configs.auth.token.accessToken.expire * 60 * 1000
        })

        await redis.set(`refresh-token:${existingUser._id}`, refreshToken, "EX", configs.auth.token.refreshToken.expire * 24 * 60 * 60)
        return successResponse(res, 200, { msg: "Login successful", data: existingUser })
    } catch (error) {
        next(error)
    }
}
