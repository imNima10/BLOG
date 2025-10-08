const { successResponse, errorResponse } = require("../helpers/responses")
const { createAccessToken, createRefreshToken } = require("../utils/token")
let User = require("../models/user")
let redis = require("../db/redis")
const configs = require("../configs")
let bcrypt = require("bcrypt")
const { generateUserKey, generateOtp, getOtpDetails, getUserKeyDetails, getOtpRedisPattern, getUserKeyRedisPattern } = require("../utils/auth")

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
        res.cookie("access-token", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: configs.auth.token.accessToken.expire * 60 * 1000
        })
        
        let refreshToken = await createRefreshToken(existingUser)
        await redis.del(`refresh-token:${existingUser._id}`)
        await redis.set(`refresh-token:${existingUser._id}`, refreshToken, "EX", configs.auth.token.refreshToken.expire * 24 * 60 * 60)

        return successResponse(res, 200, { msg: "Login successful", data: existingUser })
    } catch (error) {
        next(error)
    }
}

exports.otpPage = async (req, res, next) => {
    let { userKey } = req.params

    return res.render("otp", {
        userKey
    })
}

exports.sendOtp = async (req, res, next) => {
    try {
        let { email } = req.body
        let { expired, remainingTime } = await getOtpDetails(email)
        if (!expired) {
            return await errorResponse(res, 429, { msg: `OTP already send,please try again after ${remainingTime}` })
        }
        let userKey = await generateUserKey(email)
        let otp = await generateOtp(email)

        //TODO send OTP email to user

        return res.redirect(`/auth/local/${userKey}`)
    } catch (error) {
        next(error)
    }
}