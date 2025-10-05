let express = require("express")
let app = express()

const configs = require("./configs")
const path = require("path")

let cookieParser = require("cookie-parser")
let cors = require("cors")
let flash = require("express-flash")
let session = require("express-session")
let helmet = require("helmet")

//? middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(cors())
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: configs.session
}))
app.use(flash())
app.use(helmet())

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname,"public")))

module.exports = app