let multer = require("multer")
let path = require("path")
let fs = require("fs");

exports.uploaderStorage = ({destination, allowTypes = /jpg|jpeg|png/, fileSizeByMB = 2}) => {
    let uploadPath = path.join(__dirname, '..', 'public', 'images', destination);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath)
        },
        filename: function (req, file, cb) {
            let name = Date.now() + "-" + Math.floor(Math.random() * 1e9)
            let ext = path.extname(file.originalname)
            cb(null, name + ext)
        }
    })
    let fileFilter = function (req, file, cb) {
        if (allowTypes.test(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("File type not allowed"), false);
        }
    }

    let uploader = multer({
        storage,
        limits: {
            fileSize: (fileSizeByMB * 1024 * 1024)
        },
        fileFilter
    })
    return uploader
}
