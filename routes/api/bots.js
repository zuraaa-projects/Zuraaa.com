const express = require("express");
const botFilter = require("../../utils/botFilter");
const router = express.Router();

module.exports = (mongo) => {
    const simpleBotQuery = "-details.longDescription -details.htmlDescription ";
    router.get("/", async (req, res) => {
        const page = ((!isNaN(req.query.page) && req.query.page > 0)
            ? Number(req.query.page) : 1) - 1;

        const limit = (!isNaN(req.query.limit) && req.query.limit > 0 && req.query.limit < 15)
            ? Number(req.query.limit) : 15;
        
        res.send(await mongo.Bots.find().where("approvedBy").ne(null).select(botFilter(req.query)).skip(page*limit).limit(limit).exec());
    });

    router.get("/:id", async (req, res) => {
        res.send(await findByIdOrURL(req.params.id).select(botFilter(req.query)));
    });

    function findByIdOrURL(param) {
        return mongo.Bots.findOne().or([{_id: param}, {"details.customURL": param}]);
    }

    return router;
}