const express = require("express");
const router = express.Router();
const bots = require("./bots")

module.exports = (mongo) => {
    router.use("/bots", bots(mongo));
    return router;
};