/*
-- sudo service postgresql start -----------------------
-- createdb imageboard
-- psql -d imageboard -f sql/images.sql
-- heroku pg:psql -f sql/images.sql
*/
const spicedPg = require("spiced-pg");

//heroku
let connetionString = process.env.DATABASE_URL;
if (!connetionString) {
    connetionString = require("./secrets.json").connetionString;
}

const db = spicedPg(connetionString);

module.exports.getImages = () => {
    return db.query(`SELECT title, url FROM images;`);
};
