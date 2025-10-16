let express = require("express")
let router = express.Router()

let { getOnePost,createPostPage,createPost } = require("../controllers/post")
let { authGuard, roleGuard } = require("../middlewares/guard")
let { uploaderStorage } = require("../middlewares/uploader")
let uploader = uploaderStorage({ destination: "profiles" })

router.get("/create", authGuard, createPostPage)

router.post("/create", authGuard,uploader.single("cover"), createPost)

router.get("/:slug", authGuard, getOnePost)

module.exports = router