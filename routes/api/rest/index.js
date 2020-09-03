const bots = require("./bots");
const users = require("./users");
const router = require("express").Router();

module.exports = (mongo) => {
  router.get("", async (req, res) => {
    res.json({ message: 'Hello world!' });
  });
  router.use("/bots", bots(mongo));
  router.use("/users", users(mongo));
  return router;
};
