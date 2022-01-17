const db = require("../db.js");
const express = require("express");
const router = express.Router();

router.post("/comment", (req, res) => {
    db.addcomment(req.body)
        .then((result) => {
            if (result.rows[0].id) {
                res.json(result.rows);
            }
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});
router.get("/comments/:id*", (req, res) => {
    db.getCommentsWithId(req.params.id)
        .then((comment) => {
            res.json(comment.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});
router.get("/moreArraycomments/:id*", (req, res) => {
    db.getmoreCommentsWithId(req.params.id)
        .then((morecomment) => {
            if (morecomment.rows) {
                res.json(morecomment.rows);
            }
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});

router.post("/morecomment", (req, res) => {
    db.addmorecomment(req.body)
        .then((result) => {
            if (result.rows[0].id) {
                res.json(result.rows);
            }
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});
router.get("/morecomments/:id*", (req, res) => {
    db.getmoreCommentsWithId(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
            res.sendFile(`${__dirname}/error.html`);
        });
});
module.exports = router;
