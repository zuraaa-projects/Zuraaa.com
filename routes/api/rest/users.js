const router = require("express").Router();
const { userToJson } = require("../../../utils/user");

module.exports = (mongo) => {
  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const user = await mongo.Users.findById({ _id: id }).exec();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(userToJson(user));
  });

  router.get("", async (req, res) => {
    let limit = Math.min(Number(req.query.limit) || 1, 15);
    let after = Number(req.query.after) || 0;

    const users = await mongo.Users.aggregate([
      { $skip: after },
      { $limit: limit },
    ]);

    return res.status(200).json(users.map(userToJson));
  });
  return router;
};
