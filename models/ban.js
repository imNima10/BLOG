let mongoose = require("mongoose")

let banSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },
    bannedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    }
}, {
    timestamps: true
})

let banModel = mongoose.model("bans", banSchema)
module.exports = banModel