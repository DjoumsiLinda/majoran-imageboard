const db = require("../db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("../s3.js");
const express = require("express");
const router = express.Router();
const { urlRequest } = require("../public/js/urlRequest.js");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "../uploads"));
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

router.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});

router.get("/images/more", (req, res) => {
    db.getImagesAfter(req.query.after)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});

router.get("/images/:id*", (req, res) => {
    db.getImageWithId(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});
router.get("/delete/:id*", s3.s3deleteUrl, (req, res) => {
    //delete morecomment
    db.deletemoreComment(req.params.id)
        .then(() => {
            //delete comments
            db.deleteComment(req.params.id)
                .then(() => {
                    //delete images
                    db.deleteImage(req.params.id)
                        .then((results) => {
                            if (results.rowCount) {
                                res.json(results.rowCount);
                            }
                        })
                        .catch((e) => {
                            console.log(e);
                            res.sendStatus(500);
                            res.sendFile(`${__dirname}/error.html`);
                        });
                })
                .catch((e) => {
                    console.log(e);
                    res.sendStatus(500);
                    res.sendFile(`${__dirname}/error.html`);
                });
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});
//uploader ist ein Middleware
router.post(
    "/images/file",
    uploader.single("file"),
    s3.s3Uploader,
    (req, res) => {
        const obj = {
            title: req.body.title,
            url: null,
            description: req.body.description,
            username: req.body.username,
        };
        if (req.file.filename) {
            obj.url =
                "https://spicedling.s3.amazonaws.com/" + req.file.filename;
            addImage(obj, res);
        }
    }
);

router.post(
    "/images/url",
    uploader.single("file"),
    s3.s3Uploader,
    (req, res) => {
        const obj = {
            title: req.body.title,
            url: null,
            description: req.body.description,
            username: req.body.username,
        };
        if (req.body.url) {
            urlRequest(req.body.url).then((status) => {
                if (status !== 200) {
                    res.json({ status: status });
                } else if (status === 200) {
                    obj.url = req.body.url;
                    addImage(obj, res);
                }
            });
        }
    }
);

function addImage(obj, res) {
    db.addImage(obj)
        .then((result) => {
            if (result.rows[0].id) {
                res.json(result.rows[0]);
            }
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
}
module.exports = router;
