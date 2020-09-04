const url = require('url');

module.exports.fullUrl = (req) => {
    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
}