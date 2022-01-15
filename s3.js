const aws = require("aws-sdk");
const fs = require("fs");
const { unlink } = require("fs").promises;
const db = require("./db.js");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.s3Uploader = (req, res, next) => {
    if (req.file) {
        const { filename, mimetype, size, path } = req.file;
        s3.putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
            .promise()
            .then(() => {
                console.log("Upload successfull");
                unlink(path);
                next();
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    } else {
        console.log("ich bin a File");
        next();
    }
};

module.exports.s3deleteUrl = (req, res, next) => {
    db.getImageWithId(req.params.id)
        .then((results) => {
            var params = { Bucket: "spicedling", Key: results.rows[0].url };
            s3.deleteObject(params, function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log("succefull delete in s3", data);
                next();
            });
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
};
