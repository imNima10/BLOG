const User = require("../models/user")
let bcrypt = require("bcrypt")
const { getOtpDetails, getUserKeyDetails, getOtpRedisPattern, getUserKeyRedisPattern } = require("../utils/auth")
const redis = require("../db/redis")

let localStorage = require("passport-local").Strategy

module.exports = new localStorage({ usernameField: "userKey", passwordField: "otp" },
    async (userKey, otp, done) => {
        try {
            let isUserKeyExists = await getUserKeyDetails(userKey)
            if (!isUserKeyExists) {
                return done(null, false, { message: "Invalid or expired login link , please request a new one", status: 400 })
            }

            let isEmailExists = await User.findOne({ email: isUserKeyExists })
            if (!isEmailExists) {
                let isFirstUser = await User.countDocuments()
                isEmailExists = await User.create({ email: isUserKeyExists, role: isFirstUser ? "ADMIN" : "USER" })
            }

            let isOtpExists = await getOtpDetails(isUserKeyExists)
            if (isOtpExists.expired) {
                return done(null, false, { message: "OTP has expired, please request a new one", status: 400, type: "expiredOtp" })
            }

            let isOtpValid = await bcrypt.compare(otp, isOtpExists.otp)
            if (!isOtpValid) {
                return done(null, false, { message: "Incorrect OTP, please try again", status: 400, type: "validation" })
            }

            await redis.del(getOtpRedisPattern(isUserKeyExists))
            await redis.del(getUserKeyRedisPattern(userKey))
            return done(null, isEmailExists)
        } catch (error) {
            done({
                status: error.status || 500,
                message: "Local Login Error",
                data: error.message
            })
        }
    }
)