const events = "BOT_CREATE" | "BOT_DELETE" | "BOT_UPDATE" | "BOT_VOTE_ADD";
const eventsCode = {
  READY: 0,
  BOT_CREATE: 1,
  BOT_DELETE: 2,
  BOT_UPDATE: 3,
  BOT_VOTE_ADD: 4
};

module.exports = { events, eventsCode };
