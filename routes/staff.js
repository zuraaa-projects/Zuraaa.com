const express = require('express');

const router = express.Router();
const { userToString } = require('../utils/user');
const discordBotM = require('../utils/discordbot');

module.exports = (config, db, api) => {
  const discordBot = discordBotM(config);
  router.get('/bots', async (req, res) => {
    const user = await api.getMe(req.session.token);
    if (!user) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    if (user._id !== config.discord.ownerId) {
      if (!user || !user.details.role || user.details.role < 1) {
        res.sendStatus(403);
        return;
      }
    }
    res.render('staff/bots', {
      bots: (await db.Bots.find({ approvedBy: null }).exec()),
      bpdId: config.discord.addId,
    });
  });

  router.get('/bots/:id/aprovar', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    if (sessionUser._id !== config.discord.ownerId) {
      const user = await db.Users.findById(sessionUser._id).exec();
      if (!user || !user.details.role || user.details.role < 1) {
        res.sendStatus(403);
        return;
      }
    }

    db.Bots.findById(req.params.id).then((bot) => {
      if (!bot) {
        res.render('message', { message: 'O bot não existe.', url: '/staff/bots' });
        return;
      }
      if (bot.approvedBy) {
        res.render('message', { message: `O bot ${userToString(bot)} já está aprovado.`, url: '/staff/bots' });
        return;
      }
      bot.approvedBy = sessionUser._id;
      bot.save();
      discordBot.sendMessage(config.discord.bot.channels.botLogs, `<@${bot.owner}> O bot \`${userToString(bot)}\` foi aprovado por \`${userToString(sessionUser)}\`\n`
            + `${config.server.root}bots/${bot.id}`);
      discordBot.sendMessageDm(bot.owner, {
        title: 'Sucesso',
        color: 0x7ED321,
        description: `O seu bot \`${userToString(bot)}\` foi aprovado por \`${userToString(sessionUser)}\``,
      });
      const allOwners = [...(bot.details.otherOwners || []), bot.owner];
      for (let i = 0; i < allOwners.length; i += 1) {
        setTimeout(() => {
          discordBot.addRole(
            config.discord.bpdId,
            allOwners[i],
            config.discord.bot.roles.developer,
          );
        }, i * 500);
      }

      discordBot.removeBot(config.discord.addId, bot.id);
      res.render('message', { title: 'Sucesso', message: `O bot ${userToString(bot)} foi aprovado com sucesso.`, url: '/staff/bots' });
    });
  });
  router.get('/bots/:id/rejeitar', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    if (sessionUser._id !== config.discord.ownerId) {
      const user = await db.Users.findById(sessionUser._id).exec();
      if (!user || !user.details.role || user.details.role < 1) {
        res.sendStatus(403);
        return;
      }
    }
    res.render('staff/reject', { id: req.params.id });
  });
  router.post('/bots/rejeitar', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    if (sessionUser._id !== config.discord.ownerId) {
      const user = await db.Users.findById(sessionUser._id).exec();
      if (!user || !user.details.role || user.details.role < 1) {
        res.sendStatus(403);
        return;
      }
    }
    db.Bots.findById(req.body.id).then((bot) => {
      if (!bot) {
        res.render('message', { message: 'O bot não existe.', url: '/staff/bots' });
        return;
      }
      if (bot.approvedBy) {
        res.render('message', { message: `O bot ${userToString(bot)} foi aprovado.`, url: '/staff/bots' });
        return;
      }
      db.Bots.deleteOne({ _id: bot.id }).exec();
      discordBot.sendMessage(config.discord.bot.channels.botLogs, `<@${bot.owner}> O bot \`${userToString(bot)}\` foi rejeitado por \`${userToString(sessionUser)}\`\n`
            + `Motivo: \`${req.body.reason}\``);
      discordBot.sendMessageDm(bot.owner, {
        title: 'Não foi dessa vez',
        color: 0xff0000,
        description: `O seu bot \`${userToString(bot)}\` foi rejeitado por \`${userToString(sessionUser)}\``,
        fields: [
          {
            name: 'Motivo:',
            value: req.body.reason,
          },
        ],
        footer: {
          text: 'Você pode enviar o bot de novo quando tiver corrigido os os motivos dele ter sido rejeitado',
        },
      });
      discordBot.removeBot(config.discord.addId, bot.id);
      res.render('message', { title: 'Sucesso', message: `O bot ${userToString(bot)} foi rejeitado com sucesso.`, url: '/staff/bots' });
    });
  });

  router.get('/edit', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    if (sessionUser._id !== config.discord.ownerId) {
      const user = await db.Users.findById(sessionUser._id).exec();
      if (!user || !user.details.role || user.details.role < 2) {
        res.sendStatus(403);
        return;
      }
    }

    res.render('staff/edit', { roles: { nenhum: 0, aprovador: 1, administrador: 2 } });
  });

  router.post('/edit', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    let perm = sessionUser._id === config.discord.ownerId ? 3 : 0;
    if (!perm) {
      const user = await db.Users.findById(sessionUser._id).exec();
      if (user && user.details) { perm = user.details.role; }
    }
    if (!perm || perm < 2 || (req.body.role === 2 && perm !== 3)) {
      res.sendStatus(403);
      return;
    }

    db.Users.findByIdAndUpdate(req.body.id, { 'details.role': req.body.role }).exec();

    res.render('message', { message: `Você alterou as permissões do usuário ${req.body.id} com sucesso.`, title: 'Sucesso' });
  });

  return router;
};
