let User = require("./../models/user")
let Post = require("./../models/post")
const time = require("../utils/time")
exports.getDashbord = async (req, res, next) => {
    try {
        let usersCount = await User.countDocuments()
        let postsCount = await Post.countDocuments()

        let lastUsers = await User.find()
            .limit(3)
        let posts = await Post.find()
            .limit(3)
            .sort({ createdAt: "desc" })
            .populate("user", "username")
        let lastPosts = posts.map(post => {
            return {
                ...post.toObject(),
                updatedAt: time(post.updatedAt)
            };
        });
        return res.render("admin/dashbord", {
            usersCount,
            postsCount,
            lastUsers: lastUsers || [],
            lastPosts: lastPosts || []
        })
    } catch (error) {
        next(error)
    }
}