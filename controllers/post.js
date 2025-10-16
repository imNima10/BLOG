const buildError = require("../utils/buildError")
let Post = require("./../models/post")
exports.getOnePost = async (req, res, next) => {
    try {
        let { slug } = req.params
        let post = await Post.findOne({ slug })
            .populate("user", "username profile")
            .lean()
        if (!post) {
            throw buildError("post not found", 404)
        }
        return res.render("post", {
            post
        })
    } catch (error) {
        next(error)
    }
}