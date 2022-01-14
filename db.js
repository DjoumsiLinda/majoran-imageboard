/*
-- sudo service postgresql start -----------------------
-- createdb imageboard
-- psql -d imageboard -f sql/imagesboard.sql
-- heroku pg:psql -f sql/imagesboard.sql
*/
const spicedPg = require("spiced-pg");

let connetionString = process.env.DATABASE_URL;
if (!connetionString) {
    connetionString = require("./secrets.json").connetionString;
}

const db = spicedPg(connetionString);

module.exports.getImages = () => {
    return db.query(`
        SELECT *, (
            SELECT id AS lowestid FROM images ORDER BY id ASC LIMIT 1
        ) FROM images ORDER BY id DESC LIMIT 6;
    `);
};
module.exports.deleteImage = (id) => {
    return db.query(`DELETE FROM images where id = $1;`, [id]);
};
module.exports.addImage = (obj) => {
    return db.query(
        `INSERT INTO images (url, username, title, description)
            VALUES($1, $2, $3, $4)
            RETURNING *;`,
        [obj.url, obj.username, obj.title, obj.description]
    );
};

module.exports.getImageWithId = (id) => {
    return db.query(`SELECT * FROM images where id = $1;`, [id]);
};

module.exports.getImagesAfter = function (after) {
    return db.query(
        `SELECT *, (
            SELECT id AS lowestid FROM images ORDER BY id ASC LIMIT 1
        ) FROM images WHERE id < $1 ORDER BY id DESC LIMIT 6;`,
        [after]
    );
};

module.exports.addcomment = (obj) => {
    return db.query(
        `INSERT INTO comments (username, comment, image_id)
            VALUES($1, $2, $3)
            RETURNING id;`,
        [obj.username, obj.comment, obj.image_id]
    );
};

module.exports.getCommentsWithId = (id) => {
    return db.query(`SELECT * FROM comments where image_id = $1;`, [id]);
};

module.exports.deleteComment = (id) => {
    return db.query(`DELETE FROM comments where image_id = $1;`, [id]);
};
