let express = require("express")
let router = express.Router()

let { logout } = require("../controllers/user")
let { authGuard, roleGuard } = require("../middlewares/guard")

router.post("/logout", authGuard, logout)

module.exports = router