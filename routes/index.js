const express = require('express');
const router = express.Router();
const { partialBotObject } = require("../utils/bot");
const tags = require("../utils/tags");

module.exports = (mongo) => {
  router.get('/', async (req, res) => {
    res.render('index', {
      title: 'Início',
      bots: {
        top: (await mongo.Bots.find().limit(5).sort({"votes.current": -1})).map(partialBotObject),
        recent: (await mongo.Bots.find().limit(6).sort({"dates.sent": -1})).map(partialBotObject),
        random: (await mongo.Bots.aggregate([{$sample: {size: 12}}])).map(partialBotObject)
      },
      tags,
      description: "Encontre os bots perfeitos para divertir e elevar seu servidor para um outro nível, com a nossa extensa lista dos melhores bots brasileiros e em Português para Discord.",
      keywords: "discord, bots, lista, melhores, brasileiros, português, música, economia, moderação"
  })});
  
  router.get("/userdata", (req, res) => {
    res.send(req.session.user)
  });
  return router;
};
