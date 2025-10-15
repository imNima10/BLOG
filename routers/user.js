let express = require("express")
let router = express.Router()

let { logout, getMe, updateProfile } = require("../controllers/user")
let { authGuard, roleGuard } = require("../middlewares/guard")
let { uploaderStorage } = require("../middlewares/uploader")
let uploader = uploaderStorage({ destination: "profiles" })

router.post("/logout", authGuard, logout)

router.get("/me", authGuard, getMe)

router.post("/update", authGuard, uploader.single("profile"), updateProfile)

module.exports = router