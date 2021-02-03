const express = require('express');

const router = express.Router();
const { partialBotObject } = require('../utils/bot');
const tags = require('../utils/tags');
const colors = require('../utils/colors');

module.exports = (mongo) => {
  router.get('/', async (req, res) => {
    const filter = { approvedBy: { $ne: null } };
    res.render('index', {
      title: 'Início',
      bots: {
        top: (await mongo.Bots.find(filter).limit(6).sort({ 'votes.current': -1 })).map(partialBotObject),
        recent: (await mongo.Bots.find(filter).limit(6).sort({ 'dates.sent': -1 })).map(partialBotObject),
        random: (await mongo.Bots.aggregate([
          {
            $match: filter,
          },
          {
            $sample: { size: 12 },
          }])).map(partialBotObject),
      },
      tags,
      colors,
    });
  });

  router.get('/userdata', (req, res) => {
    res.send(req.session.user);
  });
  return router;
};
