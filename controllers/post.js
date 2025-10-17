const { isValidObjectId } = require("mongoose")
const buildError = require("../utils/buildError")
let Post = require("./../models/post")
let time = require("./../utils/time")
let fs = require("fs")
let pagination = require("./../utils/pagination")

exports.getOnePost = async (req, res, next) => {
    try {
        let { slug } = req.params
        let user = req.user
        let post = await Post.findOne({ slug })
            .populate("user", "username profile")
            .lean()
        if (!post) {
            throw buildError("post not found", 404)
        }
        post.updatedAt = time(post.updatedAt)
        return res.render("post", {
            post,
            canUpdate: post.user._id.toString() == user._id.toString()
        })
    } catch (error) {
        next(error)
    }
}
exports.createPostPage = async (req, res, next) => {
    try {
        return res.render("createPost", {
            update: false,
        })
    } catch (error) {
        next(error)
    }
}
exports.createPost = async (req, res, next) => {
    try {
        let { title, description } = req.body
        let user = req.user;
        let cover = req.file;
        filePath = `/images/covers/${cover.filename}`

        let post = await Post.create({
            cover: filePath,
            description,
            title,
            user: user._id
        })
        if (!post) {
            req.flash("error", "post dont create");
            return res.redirect("/post/create");
        }
        req.flash("success", "create successfully");
        return res.redirect(`/post/${post.slug}`);
    } catch (error) {
        next(error)
    }
}
exports.myPostsPage = async (req, res, next) => {
    try {
        let { page = 1, limit = 4 } = req.query
        let user = req.user
        let posts = await Post.find({
            user: user._id
        })
            .populate("user", "username profile")
            .sort({ createdAt: "desc" })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean()
        let postsCount = await Post.countDocuments({ user: user._id })
        return res.render("myPosts", {
            posts: posts || [],
            pagination: pagination(page, limit, postsCount, "post")
        })
    } catch (error) {
        next(error)
    }
}
exports.getUpdatePost = async (req, res, next) => {
    try {
        let { id } = req.params
        let user = req.user
        let isIdValid = await isValidObjectId(id)
        if (!isIdValid) {
            throw buildError("post not found", 404)
        }
        let post = await Post.findById(id)
        if (!post || post.user.toString() != user._id.toString()) {
            throw buildError("post not found", 404)
        }

        return res.render("createPost", {
            update: true,
            post
        })
    } catch (error) {
        next(error)
    }
}
exports.updatePost = async (req, res, next) => {
    try {
        let { id } = req.params
        let { title, description } = req.body
        let user = req.user;
        let cover = req.file;

        let isIdValid = await isValidObjectId(id)
        if (!isIdValid) {
            throw buildError("post not found", 404)
        }
        let post = await Post.findById(id)
        if (!post || post.user.toString() != user._id.toString()) {
            throw buildError("post not found", 404)
        }

        let filePath = post.cover
        if (cover) {
            let thePath = path.join(__dirname, "..", "public", filePath)
            if (fs.existsSync(thePath)) {
                fs.unlink(thePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
            filePath = `/images/covers/${cover.filename}`
        }

        let updatedPost = await Post.findByIdAndUpdate(id, {
            cover: filePath,
            description,
            title,
        }, { new: true })

        req.flash("success", "update successfully");
        return res.redirect(`/post/${updatedPost.slug}`);
    } catch (error) {
        next(error)
    }
}
exports.deletePost = async (req, res, next) => {
    try {
        let user = req.user
        let { id } = req.params

        let isIdValid = await isValidObjectId(id)
        if (!isIdValid) {
            throw buildError("post not found", 404)
        }

        let post = await Post.findById(id)
        if (!post || post.user.toString() != user._id.toString()) {
            throw buildError("post not found", 404)
        }
        await Post.findByIdAndDelete(id)

        req.flash("success", "delete successfully");
        return res.redirect(`/post/my`);
    } catch (error) {
        next(error)
    }
}