let User = require("./../models/user")
let Post = require("./../models/post")
const time = require("../utils/time")
let pagination = require("./../utils/pagination")
const { isValidObjectId } = require("mongoose")
const buildError = require("../utils/buildError")
const fs = require("fs")
const path = require("path")
exports.getDashbord = async (req, res, next) => {
    try {
        let usersCount = await User.countDocuments()
        let postsCount = await Post.countDocuments()

        let lastUsers = await User.find()
            .limit(3)
            .sort({ createdAt: "desc" })
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
exports.getAdminPosts = async (req, res, next) => {
    try {
        let { page = 1, limit = 7 } = req.query
        let posts = await Post.find()
            .populate("user", "username profile")
            .sort({ createdAt: "desc" })
            .lean()
            .limit(limit)
            .skip((page - 1) * limit)
        posts = posts.map(post => {
            return {
                ...post,
                updatedAt: time(post.updatedAt)
            };
        });
        let postsCount = await Post.countDocuments()
        return res.render("admin/posts", {
            posts,
            pagination: pagination(page, limit, postsCount, "post")
        })
    } catch (error) {
        next(error)
    }
}
exports.deletePost = async (req, res, next) => {
    try {
        let { id } = req.params

        let isIdValid = isValidObjectId(id)
        if (!isIdValid) {
            throw buildError("post not found", 404)
        }

        let post = await Post.findByIdAndDelete(id)
        if (!post) {
            throw buildError("post not found", 404)
        }
        let thePath = path.join(__dirname, "..", "public", post.cover)
        if (fs.existsSync(thePath)) {
            fs.unlink(thePath, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
        req.flash("success", "delete successfully");
        return res.redirect(`/admin/posts`);
    } catch (error) {
        next(error)
    }
}
exports.getAdminUsers = async (req, res, next) => {
    try {
        let { page = 1, limit = 7 } = req.query
        let users = await User.find()
            .sort({ createdAt: "desc" })
            .lean()
            .limit(limit)
            .skip((page - 1) * limit)
        let usersCount = await User.countDocuments()
        return res.render("admin/users", {
            users,
            pagination: pagination(page, limit, usersCount, "user")
        })
    } catch (error) {
        next(error)
    }
}
exports.changeRole = async (req, res, next) => {
    try {
        let { id } = req.params

        let isIdValid = isValidObjectId(id)
        if (!isIdValid) {
            throw buildError("user not found", 404)
        }

        let user = await User.findById(id)
        if (!user) {
            throw buildError("user not found", 404)
        }

        if (user._id.toString() === req.user._id.toString()) {
            req.flash("error", "you cant change your role");
            return res.redirect("/admin/users");
        }
        await User.findByIdAndUpdate(id, {
            role: user.role == "ADMIN" ? "USER" : "ADMIN"
        })
        req.flash("success", "Role changed successfully");
        return res.redirect(`/admin/users`);
    } catch (error) {
        next(error)
    }
}