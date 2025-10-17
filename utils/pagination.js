module.exports = (page, limit, totalCount, name) => {
    return {
        page,
        limit,
        totalPage: Math.ceil(totalCount / limit),
        ["total" + name]: totalCount
    }
}