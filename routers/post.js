let express = require("express")
let router = express.Router()

let { getOnePost, createPostPage, createPost, myPostsPage, getUpdatePost, updatePost, deletePost } = require("../controllers/post")
let { authGuard, roleGuard } = require("../middlewares/guard")
let { uploaderStorage } = require("../middlewares/uploader")
let uploader = uploaderStorage({ destination: "covers" })

router.get("/create", authGuard, createPostPage)

router.post("/create", authGuard, uploader.single("cover"), createPost)

router.get("/my", authGuard, myPostsPage)

router.get("/update/:id", authGuard, getUpdatePost)

router.post("/update/:id", authGuard, uploader.single("cover"), updatePost)

router.post("/delete/:id", authGuard, deletePost)

router.get("/:slug", authGuard, getOnePost)

module.exports = router