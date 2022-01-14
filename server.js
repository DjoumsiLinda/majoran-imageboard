const express = require("express");
const server = express();
const routesImages = require("./routes/routesImages.js");
const routesComments = require("./routes/routesComments.js");

server.use((req, res, next) => {
    console.log("📢", req.method, req.url);
    next();
});

server.use(express.static("./uploads"));
server.use(express.static("./public"));

server.use(express.json());
server.use(routesImages);
server.use(routesComments);

server.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

server.listen(process.env.PORT || 8083, () =>
    console.log(`I'm listening. http://localhost:8083`)
);

//git remote add heroku https://git.heroku.com/einfuegenimageboards.git
