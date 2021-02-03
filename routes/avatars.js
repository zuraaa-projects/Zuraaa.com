const { Router } = require('express');

const router = Router();

module.exports = (mongo) => {
  router.get('/bots/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
      const bot = await mongo.Bots.findById(id).select('avatarBuffer').exec();
      if (bot && bot.avatarBuffer && bot.avatarBuffer.contentType) {
        const image = Buffer.from(bot.avatarBuffer.data.toString('binary'), 'base64');
        res.writeHead(200, {
          'Content-Type': bot.avatarBuffer.contentType,
          'Content-Length': image.length,
        });
        res.end(image);
        return;
      }
    }
    res.redirect('https://cdn.discordapp.com/embed/avatars/4.png');
  });
  return router;
};
