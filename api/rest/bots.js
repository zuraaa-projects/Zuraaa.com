const { partialBotObject } = require("../../utils/bot");

const router = require("express").Router();

module.exports = (mongo) => {
  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const bot = await mongo.Bots.findById({ _id: id }).exec();
    if (!bot) return res.status(404).json({ message: "Bot not found" });
    return res.status(200).json(partialBotObject(bot));
  });

  router.get("", async (req, res) => {
    let limit = Math.min(Number(req.query.limit) || 1, 15);
    let after = Number(req.query.after) || 0;

    const bots = await mongo.Bots.aggregate([
      { $skip: after },
      { $limit: limit },
    ]);

    return res.status(200).json(bots.map(partialBotObject));
  });
  return router;
};
