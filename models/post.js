let mongoose = require("mongoose")
let slugify = require("slugify");

let postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

postSchema.pre("validate", async function (next) {
    if (!this.slug || this.isModified("title")) {
        let baseSlug = slugify(this.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (await mongoose.models.posts.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    next();
});


let postModel = mongoose.model("posts", postSchema)
module.exports = postModel