module.exports = (post) => {
    return post.description.length > 150
        ? post.description.substring(0, 150) + "..."
        : post.description;
};