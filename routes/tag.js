const express = require("express");
const router = express.Router();
const tags = require("../utils/tags");
const { partialBotObject } = require("../utils/bot");

module.exports = (db) => {
    router.get("/:tag", (req, res) => {
        const tagName = tags[req.params.tag];
        let page = req.query.page;
        if (!page || isNaN(page) || page < 1) 
            page = 1
        db.Bots.find({"details.tags": tagName}).limit(18).skip((page-1) * 18).exec().then(bots => {
            res.render("tags", {title: tagName, tag: tagName, page, bots: (bots || []).map(partialBotObject)});
        });
    });

    return router;
}
