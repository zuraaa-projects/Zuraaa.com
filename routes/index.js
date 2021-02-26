const express = require('express');

const router = express.Router();
const tags = require('../utils/tags');
const colors = require('../utils/colors');

module.exports = (mongo, api) => {
  router.get('/', async (req, res) => {
    const filter = { approvedBy: { $ne: null } };
    res.render('index', {
      title: 'Início',
      bots: {
        top: (await mongo.Bots.find(filter).limit(6).sort({ 'votes.current': -1 })),
        recent: (await mongo.Bots.find(filter).limit(6).sort({ 'dates.sent': -1 })),
        random: (await mongo.Bots.aggregate([
          {
            $match: filter,
          },
          {
            $sample: { size: 12 },
          }])),
      },
      tags,
      colors,
    });
  });

  router.get('/userdata', async (req, res) => {
    res.send(await api.getMe(req.session.token));
  });
  return router;
};
