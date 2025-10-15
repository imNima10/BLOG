let mongoose = require("mongoose")
let { nanoid } = require("nanoid")

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    profile: {
        type: String,
        default:"/images/default_profile.png",
        required:true
    },
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (this.email) {
        let username = this.email.split("@")[0]
        let theUsername = username
        let isUserExistsWithThisUsername = await this.constructor.findOne({ username })
        while (isUserExistsWithThisUsername) {
            username = `${theUsername}_${nanoid(3)}`
            isUserExistsWithThisUsername = await this.constructor.findOne({ username })
        }
        this.username = username
    }
    next()
})

let userModel = mongoose.model("users", userSchema)
module.exports = userModel