const { successResponse, errorResponse } = require("../helpers/responses")
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require("../utils/token")
let User = require("../models/user")
let redis = require("../db/redis")
const configs = require("../configs")
let bcrypt = require("bcrypt")
const { generateUserKey, generateOtp, getOtpDetails, getUserKeyDetails, getOtpRedisPattern, getUserKeyRedisPattern } = require("../utils/auth")
let otpSender = require("../services/otp")
let buildError = require("../utils/buildError")

exports.getLogin = async (req, res, next) => {
    return res.render("login")
}

exports.login = async (req, res, next) => {
    try {
        let user = req.user

        if (!user) {
            throw buildError("User information is missing", 500)
        }

        let existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
            throw buildError("User not found, please login again", 500)
        }

        let accessToken = await createAccessToken(existingUser)
        if (!accessToken.success) {
            throw buildError(accessToken.message, accessToken.status, accessToken.data);
        }
        res.cookie("access-token", accessToken.token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: configs.auth.token.accessToken.expire * 60 * 1000
        })

        let refreshToken = await createRefreshToken(existingUser)
        if (!refreshToken.success) {
            throw buildError(refreshToken.message, refreshToken.status, refreshToken.data);
        }
        await redis.del(`refresh-token:${existingUser._id}`)
        await redis.set(`refresh-token:${existingUser._id}`, refreshToken.token, "EX", configs.auth.token.refreshToken.expire * 24 * 60 * 60)

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
        let { email, userKey } = req.body
        if (email) {
            let { expired, remainingTime } = await getOtpDetails(email)
            if (!expired) {
                req.flash("error", `OTP already send,please try again after ${remainingTime}`)
                return res.redirect("/auth/login")
            }
            userKey = await generateUserKey(email)
            let otp = await generateOtp(email)
            await otpSender({ email, otp })
        } else {
            let isUserKeyValid = await getUserKeyDetails(userKey)
            if (isUserKeyValid) {
                let { expired, remainingTime } = await getOtpDetails(isUserKeyValid)
                if (!expired) {
                    req.flash("error", `OTP already send,please try again after ${remainingTime}`)
                    return res.redirect(`/auth/local/${userKey}`)
                }
                let otp = await generateOtp(isUserKeyValid)
                await otpSender({ email: isUserKeyValid, otp })
            } else {
                req.flash("error", `Invalid or expired login link , please request a new one`)
                return res.redirect("/auth/login")
            }
        }
        req.flash("success", "OTP send successfully")
        return res.redirect(`/auth/local/${userKey}`)
    } catch (error) {
        next(error)
    }
}
exports.logout = async (req, res, next) => {
    try {
        let user = req.user
        let refreshToken = await redis.get(`refresh-token:${user._id}`)
        if (refreshToken) {
            let result = await verifyRefreshToken(refreshToken)
            if (!result.success) {
                throw buildError(result.message, result.status, result.data)
            }
            await redis.del(`refresh-token:${user._id}`)
        }
        res.clearCookie("access-token", {
            httpOnly: true,
            sameSite: "strict",
        })
        return successResponse(res, 200, { msg: "Logout successful" })
    } catch (error) {
        next(error)
    }
}