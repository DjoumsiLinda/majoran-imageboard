module.exports.urlRequest = function (url) {
    // core module to handle HTTP requests + responses
    const https = require("https");

    return new Promise((resolve) => {
        https.get(url, (res) => {
            console.log(` Code: ${res.statusCode}`);
            resolve(res.statusCode);
        });
    });
};
