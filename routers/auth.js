let express = require("express")
let router = express.Router()

let { getLogin, login, otpPage, sendOtp} = require("../controllers/auth")
const passport = require("passport")

router.get("/login", getLogin)

//? login with google strategy
router.get("/google", passport.authenticate("google", { session: false, scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/login" }), login)

//? login with local strategy
router.post("/local/verify", (req, res, next) => {
    passport.authenticate("local", { session: false, failureRedirect: "/auth/login" }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return next(info);

        req.user = user
        return login(req, res, next)
    })(req, res, next)
})
router.get("/local/:userKey", otpPage)
router.post("/local", sendOtp)

module.exports = router