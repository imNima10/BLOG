let app = require("./app")
let configs = require("./configs")
let redis = require("./db/redis");
let mongoose = require("mongoose");

(async function () {
    try {
        await app.listen(configs.port, () => {
            console.log(`server run on port ${configs.port}`);
        })

        await mongoose.connect(configs.db.mongo.uri)
        console.log("connect to DB");

        await redis.ping().then((pong) => {
            console.log(`PING -> ${pong}`);
        })
    } catch (error) {
        await mongoose.disconnect()
        await redis.disconnect()
        throw error
    }
})()