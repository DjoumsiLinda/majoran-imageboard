const express = require("express");
const server = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const { urlRequest } = require("./public/js/urlRequest.js");
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
    db.getImages()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});

server.get("/images/more", (req, res) => {
    db.getImagesAfter(req.query.after)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});

server.get("/images/:id*", (req, res) => {
    db.getImageWithId(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});
server.get("/delete/:id*", s3.s3deleteUrl, (req, res) => {
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
                });
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});
//uploader ist ein Middleware
server.post(
    "/images",
    uploader.single("file"),
    /*s3.s3Uploader,*/ (req, res) => {
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
        } else if (req.file.filename) {
            obj.url =
                /*"https://spicedling.s3.amazonaws.com/"+*/ req.file.filename;
            addImage(obj, res);
        }
    }
);

server.post("/comment", (req, res) => {
    db.addcomment(req.body)
        .then((result) => {
            if (result.rows[0].id) {
                res.json(result.rows[0].id);
            }
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});
server.get("/comments/:id*", (req, res) => {
    db.getCommentsWithId(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});

server.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

server.listen(process.env.PORT || 8082, () =>
    console.log(`I'm listening. http://localhost:8082`)
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
        });
}
//
//git remote add heroku https://git.heroku.com/einfuegenimageboards.git
