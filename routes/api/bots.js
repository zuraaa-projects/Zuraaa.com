const express = require('express');
const botFilter = require('../../utils/botFilter');

const router = express.Router();
const { botObjectSender } = require('../../utils/bot');

module.exports = (mongo) => {
  function findByIdOrURL(param) {
    return mongo.Bots.findOne().or([{ _id: param }, { 'details.customURL': param }]);
  }

  router.get('/', async (req, res) => {
    const page = ((!Number.isNaN(req.query.page) && req.query.page > 0)
      ? Number(req.query.page) : 1) - 1;

    const limit = (!Number.isNaN(req.query.limit) && req.query.limit > 0 && req.query.limit < 15)
      ? Number(req.query.limit) : 15;

    const documents = await mongo.Bots.find().where('approvedBy').ne(null).select(botFilter(req.query))
      .skip(page * limit)
      .limit(limit)
      .exec();
    for (let i = 0; i < documents.length; i += 1) {
      documents[i] = botObjectSender(documents[i]);
    }

    res.send(documents);
  });

  router.get('/:id', async (req, res) => {
    const doc = await findByIdOrURL(req.params.id).select(botFilter(req.query));
    if (!doc) {
      res.status(404).send({
        error: `O bot ${req.params.id} não foi encontrado.`,
      });
      return;
    }
    res.send(botObjectSender(doc));
  });

  return router;
};
