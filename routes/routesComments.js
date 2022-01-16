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
    const obj = {
        comment: null,
        moreComment: null,
    };
    db.getCommentsWithId(req.params.id)
        .then((results) => {
            obj.comment = results.rows;
            db.getCommentsWithId(req.params.id)
                .then((comment) => {
                    if (comment.rows[0].id) {
                        db.getmoreCommentsWithId(comment.rows[0].id)
                            .then((morecomment) => {
                                if (morecomment.rows) {
                                    obj.moreComment = morecomment.rows;
                                }
                                res.json(obj);
                            })
                            .catch((e) => {
                                console.log(e);
                                res.sendStatus(500);
                            });
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
        });
});
module.exports = router;
