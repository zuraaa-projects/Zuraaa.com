const express = require("express");
const botFilter = require("../../utils/botFilter");
const router = express.Router();

module.exports = (mongo) => {
    router.get("/:id", (req, res) => {
        let query = "username discriminator avatar dates details.description"
        if (req.query.buffer !== undefined)
            query += " avatarBuffer"
        mongo.Users.findById(req.params.id).select(query).then(user => {
            if (!user)
                return res.sendStatus(404);
            res.send(user);
        });
    });

    router.get("/:id/bots", async (req, res) => {
        res.send((await mongo.Bots.find().or([{owner: req.params.id}, {"details.otherOwners": req.params.id}]).select(botFilter(req.query))));
    })
    return router;
}