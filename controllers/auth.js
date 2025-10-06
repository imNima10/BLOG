const { successResponse, errorResponse } = require("../helpers/responses")
let User = require("../models/user")

exports.getLogin = async (req, res, next) => {
    return res.render("login")
}

exports.login = async (req, res, next) => {
    try {
        let user = req.user

        if (!user) {
            return errorResponse(res, 400, { msg: "User information is missing" })
        }

        let existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
            return errorResponse(res, 401, { msg: "User not found, please login again" })
        }

        // TODO: Create AccessToken & RefreshToken

        return successResponse(res, 200, { msg: "Login successful", data: existingUser })
    } catch (error) {
        next(error)
    }
}
