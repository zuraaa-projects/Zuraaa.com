const express = require("express");
const router= express.Router();

module.exports = (mongo) => {
    router.get("/aa", (req, res) => {
        res.send("oi")
    });
    return router;
}