const express = require("express");
const server = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, //2MB
    },
});

server.use((req, res, next) => {
    console.log("📢", req.method, req.url);
    next();
});

server.use(express.static("./uploads"));
server.use(express.static("./public"));

server.use(express.json());

server.get("/images", (req, res) => {
    db.getImages().then((results) => {
        res.json(results.rows);
    });
});

//uploader ist ein Middleware
server.post("/images", uploader.single("file"), s3.s3Uploader, (req, res) => {
    const obj = {
        title: req.body.title,
        url: "https://spicedling.s3.amazonaws.com/" + req.file.filename,
        description: req.body.description,
        username: req.body.username,
    };
    db.addImage(obj).then((result) => {
        if (result.rows[0].id) {
            res.json(obj);
        }
    });
});
server.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

server.listen(process.env.PORT || 8080, () =>
    console.log(`I'm listening. http://localhost:8080`)
);
//
//git remote add heroku https://git.heroku.com/einfuegenimageboards.git
