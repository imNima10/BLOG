const configs = require("../configs")
let User = require("../models/user")

let googleStrategy = require("passport-google-oauth20").Strategy
console.log(`${configs.domain}/auth/google/callback`);

module.exports = new googleStrategy({
    clientID: configs.auth.google.clientId,
    clientSecret: configs.auth.google.clientSecret,
    callbackURL: `${configs.domain}/auth/google/callback`
}, async function (accessToken, refreshToken, profile, cb) {
    try {
        let email = profile.emails[0].value
        if (!email) return cb(new Error("Email not found in Google profile!!"));
        let isUserExists = await User.findOne({ email })
        if (isUserExists) {
            return cb(null, isUserExists)
        }
        let user = await User.create({ email })
        return cb(null, user)
    } catch (error) {
        cb(error)
    }
})