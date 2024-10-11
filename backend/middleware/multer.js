const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../temp"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-name-${file.originalname}`);
    },
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});


const upload = multer({storage});

module.exports = upload;