let express = require("express")
let router = express.Router()

let { getLogin, login } = require("../controllers/auth")
const passport = require("passport")

router.get("/login", getLogin)

//? login with google strategy
router.get("/google", passport.authenticate("google", { session: false, scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/login" }), login)

module.exports = router