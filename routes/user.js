const express = require('express');

const router = express.Router();

module.exports = (api) => {
  router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    api.getUser(userId).then(async (user) => {
      if (!user) { res.sendStatus(404); }

      if (user) {
        res.render('user', {
          user: {
            name: user.username,
            id: userId,
            tag: user.discriminator,
            bio: user.details.description || 'Esse usuário ainda não definiu uma biografia.',
          },
          bots: (await api.getUserBots(userId)),
          title: user.username,
        });
      } else {
        res.render('message', {
          message: 'Usuário não encontrado!',
        });
      }
    });
  });
  return router;
};
