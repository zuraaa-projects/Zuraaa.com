const express = require('express');

const router = express.Router();
const bots = require('./bots');
const users = require('./users');

module.exports = (mongo) => {
  router.use('/bots', bots(mongo));
  router.use('/users', users(mongo));
  return router;
};
