const express = require("express");
const server = express();
const db = require("./db.js");

server.use((req, res, next) => {
    console.log("📢", req.method, req.url, req.session);
    next();
});

server.use(express.static("./public"));

server.use(express.json());

server.get("/images", (req, res) => {
    db.getImages().then((results) => {
        res.json(results.rows);
    });
});
server.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

server.listen(8080, () => console.log(`I'm listening. http://localhost:8080`));
