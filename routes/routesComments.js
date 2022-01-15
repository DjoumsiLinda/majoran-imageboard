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
        });
});
router.get("/comments/:id*", (req, res) => {
    db.getCommentsWithId(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});

router.post("/morecomment", (req, res) => {
    db.addmorecomment(req.body)
        .then((result) => {
            if (result.rows[0].id) {
                console.log(result.rows);
                res.json(result.rows);
            }
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});
module.exports = router;
