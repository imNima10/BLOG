let express = require("express")
let router = express.Router()

let { getLogin, login, otpPage, sendOtp, logout } = require("../controllers/auth")
const passport = require("passport")
let { page, send, verify } = require("../validators/auth")
let validator = require("../middlewares/validator")
let { authGuard, roleGuard } = require("../middlewares/guard")

router.get("/login", getLogin)

//? login with google strategy
router.get("/google", passport.authenticate("google", { session: false, scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/login" }), login)

//? login with local strategy
router.post("/local/verify", validator(verify), (req, res, next) => {
    passport.authenticate("local", { session: false, failureRedirect: "/auth/login" }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return next(info);

        req.user = user
        return login(req, res, next)
    })(req, res, next)
})
router.get("/local/:userKey", validator(page, "params"), otpPage)
router.post("/local", validator(send), sendOtp)

router.get("/logout", authGuard, logout)

module.exports = router