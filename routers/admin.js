let express = require("express");
let router = express.Router();
let { authGuard, roleGuard } = require("../middlewares/guard");
let {
    getDashbord,
    getAdminPosts,
    getAdminUsers,
    deletePost,
    changeRole,
    ban,
    getBannedUsers,
    getPost
} = require("./../controllers/admin");

router.get("/", authGuard, roleGuard, getDashbord);
router.get("/posts", authGuard, roleGuard, getAdminPosts);
router.post("/post/:id/delete", authGuard, roleGuard, deletePost);
router.get("/post/:slug", authGuard, roleGuard, getPost);
router.get("/users", authGuard, roleGuard, getAdminUsers);
router.post("/users/:id/change-role", authGuard, roleGuard, changeRole);
router.post("/users/:id/ban", authGuard, roleGuard, ban);
router.get("/banned-users", authGuard, roleGuard, getBannedUsers);

module.exports = router;