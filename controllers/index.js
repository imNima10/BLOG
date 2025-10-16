let Post = require("./../models/post")
exports.indexPage = async (req, res, next) => {
    try {
        let posts = await Post.find()
            .populate("user", "username profile")
            .sort({ createdAt: "desc" })
            .lean()
        return res.render("index", {
            posts: posts || []
        })
    } catch (error) {
        next(error)
    }
}