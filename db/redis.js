let { Redis } = require("ioredis")
let configs = require("./../configs")

let redis = new Redis(configs.db.redis.uri)

module.exports = redis