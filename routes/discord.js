const express = require("express");
const router = express.Router();


module.exports = (config) => {
    router.get("/", (req, rest) => {
        res.redirect(config.discord.servers.support);
    });

    return router;
}