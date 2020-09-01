const bots = require("./bots");
const users = require("./users");
const router = require("express").Router();

module.exports = (mongo) => {
  router.get("", async (req, res) => {
    res.send(`<script>
    var ws = new WebSocket('ws://127.0.0.1');
    ws.onerror = function () {
      console.log('WebSocket error');
    };
    ws.onopen = function () {
      console.log('WebSocket connection established');
    };
    ws.onclose = function () {
      console.log('WebSocket connection closed');
      ws = null;
    };
    ws.onmessage = ({data}) => ws.send(data)
</script>`);
  });
  router.use("/bots", bots(mongo));
  router.use("/users", users(mongo));
  return router;
};
