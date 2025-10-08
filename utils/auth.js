let redis = require("../db/redis")
let bcrypt = require("bcrypt")

function getOtpRedisPattern(email) {
    return `otp:${email}`
}
async function getOtpDetails(email) {
    let otpPattern = getOtpRedisPattern(email)
    let otp = await redis.get(otpPattern)
    if (!otp) {
        return {
            expired: true,
            remainingTime: 0
        }
    }
    let remainingTime = await redis.ttl(otpPattern)
    let min = Math.floor(remainingTime / 60)
    let sec = Math.floor(remainingTime % 60)
    let time = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
    return {
        expired: false,
        remainingTime: time,
        otp
    }
}
async function generateOtp(email, length = 6, expireTime = 1) {
    let digits = "0123456789"
    let otp = ""
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * digits.length)
        otp += index
    }
    let hashedOtp = await bcrypt.hash(otp, 10)
    await redis.set(getOtpRedisPattern(email), hashedOtp, "EX", expireTime * 60)
    console.log("otp =>" + otp);

    return otp
}

function getUserKeyRedisPattern(userKey) {
    return `email:${userKey}`
}
async function generateUserKey(email, length = 10, expireTime = 10) {
    let digits = "0123456789"
    let userKey = ""
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * digits.length)
        userKey += index
    }
    await redis.set(getUserKeyRedisPattern(userKey), email, "EX", expireTime * 60)
    console.log("userKey =>" + userKey);

    return userKey
}
async function getUserKeyDetails(userKey) {
    let userKeyPattern = getUserKeyRedisPattern(userKey)
    let isUserKeyExists = await redis.get(userKeyPattern)
    if (!isUserKeyExists) {
        return false
    }
    return isUserKeyExists

}

module.exports = {
    getOtpRedisPattern,
    getOtpDetails,
    generateOtp,
    getUserKeyRedisPattern,
    generateUserKey,
    getUserKeyDetails
}