const express = require('express');

const router = express.Router();
const validUrl = require('valid-url');
const md = require('markdown-it')();
const tags = require('../utils/tags');
const bot = require('../utils/discordbot');
const { userToString } = require('../utils/user');
const libraries = require('../utils/libraries');
const { captchaIsValid } = require('../utils/captcha');
const colors = require('../utils/colors');
const formatDate = require('../utils/formatDate');

function defaultInvite(id) {
  return `https://discord.com/api/v6/oauth2/authorize?client_id=${id}&scope=bot`;
}

/**
 * @param {*} config
 */
module.exports = (config, api) => {
  const dBot = bot(config);
  async function validateForm(body, req, res, botTags, owners) {
    if (!(await captchaIsValid(config.recaptcha, body['g-recaptcha-response']))) {
      res.render('message', {
        message: 'O Captcha precisa ser validado.',
        url: req.originalUrl,
      });
      return false;
    }
    if (owners && owners.some((o) => Number.isNaN(o) || o.length !== 18)) {
      res.render('message', {
        message: 'Lista de donos inválida.',
        url: req.originalUrl,
      });
      return false;
    }
    if (Number.isNaN(body.id) || body.id.length !== 18) {
      res.render('message', {
        message: 'ID do bot fornecido é inválido.',
        url: req.originalUrl,
      });
      return false;
    }
    if (!body.library || !libraries.includes(body.library)) {
      res.render('message', {
        message: 'Biblioteca fornecida é inválida.',
        url: req.originalUrl,
      });
      return false;
    }
    if (body.webhook) {
      if (!validUrl.isUri(body.webhook)) {
        res.render('message', {
          message: 'O url do webhook não é valido.',
          url: req.originalUrl,
        });
        return false;
      }
      if (!body.authorization) {
        res.render('message', {
          message: 'Você tem que especificar o Authorization a ser enviado.',
          url: req.originalUrl,
        });
        return false;
      }
    }
    if (body.support && body.support.length > 2083) {
      res.render('message', {
        message: 'Link do servidor de suporte é inválido.',
        url: req.originalUrl,
      });
      return false;
    }
    if (!body.prefix || body.prefix.length > 15) {
      res.render('message', {
        message: 'Prefixo do bot é inválido.',
        url: req.originalUrl,
      });
      return false;
    }
    if (!body.shortdesc || body.shortdesc.length < 2 || body.shortdesc.length > 300) {
      res.render('message', {
        message: 'Descrição curta é inválida.',
        url: req.originalUrl,
      });
      return false;
    }
    if (body.longdesc && body.longdesc.length > 10000) {
      res.render('message', {
        message: 'Descrição longa é inválida.',
        url: req.originalUrl,
      });
      return false;
    }
    const allTags = Object.keys(tags);
    if (
      !botTags.length
            || botTags.length > 6
            || botTags.some((t) => !allTags.includes(t))
    ) {
      res.render('message', {
        message: 'Tags do bot é/são inválida(s).',
        url: req.originalUrl,
      });
      return false;
    }
    return true;
  }

  async function saveBot(form, token, ownerID, update = false) {
    const bit = {
      prefix: form.prefix, //
      tags: form.botTags, //
      customInviteLink: form.custominvite, //
      library: form.library, //
      shortDescription: form.shortdesc, //
      longDescription: form.longdesc, //
      otherOwners: form.owners.filter((owner) => owner !== ownerID), //
      website: form.website, //
      supportServer: form.server, //
    };
    if (!update) {
      return api.addBot(bit, token);
    }
    return api.updateBot(form.id, bit, token);
  }

  function stringToArray(string) {
    return [
      ...new Set(typeof string === 'string' ? [string] : string || []),
    ];
  }

  router.get('/', (req, res) => {
    let { page } = req.query;
    const { search } = req.query;
    if (!page || Number.isNaN(page) || page < 1) {
      page = 1;
    }
    api.getBots(search, page)
      .then((bots) => {
        res.render('bots/bots', {
          title: 'Bots', page, search, bots,
        });
      });
  });

  router.get('/add', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    res.render('bots/add', {
      tags, title: 'Adicionar Bot', libraries, captcha: config.recaptcha.public,
    });
  });

  router.get('/:id', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    api.getBot(req.params.id).then(async (dbot) => {
      if (dbot != null) {
        if (!dbot || !dbot.approvedBy) {
          if (!sessionUser) {
            res.sendStatus(404);
            return;
          }
          const user = await api.getUser(sessionUser._id);
          if (!user || !user.details.role || user.details.role < 1) {
            res.sendStatus(404);
            return;
          }
        }

        if (!dbot.details.htmlDescription) {
          dbot.details.htmlDescription = md.render(dbot.details.longDescription);
        }

        const botTags = dbot.details.tags;
        const owners = await Promise.all(
          [...new Set([...(dbot.details.otherOwners || []), dbot.owner])]
            .map((userId) => api.getUser(userId)),
        );

        res.render(`bots/bot${req.query.frame ? 'frame' : ''}`, {
          bot: {
            name: dbot.username,
            id: dbot._id,
            tag: dbot.discriminator,
            bio: dbot.details.shortDescription,
            votes: dbot.votes.current,
            tags: botTags,
            content: dbot.details.htmlDescription,
            url: `/bots/${dbot.details.customURL || dbot._id}/`,
            support: dbot.details.supportServer,
            website: dbot.details.website,
            owners,
            prefix: dbot.details.prefix,
            library: dbot.details.library,
            guilds: dbot.details.guilds ? `±${dbot.details.guilds}` : '???',
          },
          title: dbot.username,
          colors,
          tags,
          user: sessionUser,
        });
      } else {
        res.sendStatus(404);
      }
    });
  });

  router.get('/:id/add', (req, res) => {
    api.getBot(req.params.id).then((dbot) => {
      if (!dbot) {
        res.sendStatus(404);
        return;
      }
      res.redirect(dbot.details.customInviteLink || defaultInvite(dbot._id));
    });
  });

  router.get('/:id/votar', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }

    api.getBot(req.params.id).then((dbot) => {
      res.render('bots/votar', { captcha: config.recaptcha.public, title: `Vote em ${dbot.username}`, bot: { name: dbot.username, id: dbot._id } });
    });
  });

  router.post('/:id/votar', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    if (!(await captchaIsValid(config.recaptcha, req.body['g-recaptcha-response']))) {
      res.render('message', {
        message: 'O Captcha precisa ser validado.',
        url: req.originalUrl,
      });
      return;
    }

    api.getUser(sessionUser._id).then((user) => {
      if (user) {
        api.getBot(req.params.id).then(async (dot) => {
          if (!dot) {
            res.sendStatus(404);
            return;
          }

          const result = await api.vote(dot._id, req.session.token);
          if (!result) {
            req.session.path = req.originalUrl;
            res.redirect('/oauth2/login');
            return;
          }

          if (result.cooldown) {
            const time = formatDate(result.nextVote, 'America/Sao_Paulo', 'HH:mm[min]');
            res.render('message', {
              message: `Você precisa esperar até às ${time} para poder votar novamente.`,
            });
            return;
          }

          dBot.sendMessage(config.discord.bot.channels.botLogs, `${userToString(user)} (${user._id}) votou no bot \`${userToString(dot)}\`\n`
            + `${config.server.root}bots/${dot.details.customURL || dot._id}`);
          res.render('message', {
            title: 'Sucesso',
            message: `Você votou em ${dot.username} com sucesso.`,
          });
        });
      }
    });
  });

  router.get('/:id/editar', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    api.getBot(req.params.id).then((dbot) => {
      if (!dbot) {
        res.sendStatus(404);
        return;
      }
      if (!([...dbot.details.otherOwners, dbot.owner].includes(sessionUser._id))) {
        res.sendStatus(403);
        return;
      }
      res.render('bots/editar', {
        bot: dbot, libraries, tags, captcha: config.recaptcha.public,
      });
    });
  });

  router.post('/editar', async (req, res) => {
    const sessionUser = await api.getMe(req.session.token);
    if (!sessionUser) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    api.getBot(req.body.id).then((dbot) => {
      if (!dbot) {
        res.sendStatus(404);
        return;
      }
      const updateBot = req.body;
      const botTags = stringToArray(req.body.tags);
      const owners = stringToArray(req.body.owners);
      validateForm(req.body, req, res, botTags, owners).then(async (result) => {
        if (result) {
          if (!([...dbot.details.otherOwners, dbot.owner].includes(sessionUser._id))) {
            res.sendStatus(403);
            return;
          }

          const form = {
            ...updateBot,
            botTags,
            owners,
          };

          saveBot(form, req.session.token, sessionUser._id, true);
          const url = dbot.details.customURL || dbot.id;
          console.log(sessionUser);
          dBot.sendMessage(config.discord.bot.channels.botLogs,
            `\`${userToString(sessionUser)}\` editou o bot **\`${userToString(dbot)}\`** (${dbot.id}).\n`
                        + `${config.server.root}bots/${url}`);
          res.render('message', { message: `Você editou o bot ${userToString(dbot)} com sucesso.`, title: 'Sucesso', url: `/bots/${url}` });
        }
      });
    });
  });

  router.post('/add', async (req, res) => {
    try {
      const sessionUser = await api.getMe(req.session.token);
      if (!sessionUser) {
        req.session.path = req.originalUrl;
        res.redirect('/oauth2/login');
        return;
      }
      const newBot = req.body;
      const botTags = stringToArray(newBot.tags);
      const owners = stringToArray(newBot.owners);
      validateForm(newBot, req, res, botTags, owners).then((result) => {
        if (result) {
          // if (!user) {
          //   res.render('message', {
          //     message: 'O ID fornecido é inválido.',
          //     url: req.originalUrl,
          //   });
          //   return;
          // }

          // if (!user.bot) {
          //   res.render('message', {
          //     message: `O ID fornecido pertence a ${userToString(
          //       user,
          //     )}, que não é um bot.`,
          //     url: req.originalUrl,
          //   });
          //   return;
          // }
          api.getBot(newBot.id)
            .then(async (dbUser) => {
              if (dbUser) {
                res.render('message', {
                  message: `O ID fornecido pertence a ${userToString(
                    dbUser,
                  )}, que já está cadastrado no sistema.`,
                  url: req.originalUrl,
                });
                return;
              }

              // dBot.sendMessage(
              //   config.discord.bot.channels.botLogs,
              //   `\`${userToString(sessionUser)}\` enviou o bot **\`${userToString(dbUser)}\`**`
              //   + `(${newBot.id}) para a aprovação. <@&${config.discord.bot.roles.verifier}>`,
              // );
              // dBot.sendMessageDm(sessionUser._id, {
              //   title: 'O seu bot foi enviado para aprovação',
              //   color: 0xfbff00,
              //  description: `O seu bot \`${userToString(dbUser)}\` foi para a fila de aprovação`,
              // });

              const form = {
                ...newBot,
                botTags,
                owners,
              };

              const saved = await saveBot(form, req.session.token, sessionUser._id);
              res.render('message', {
                title: 'Sucesso',
                message: `O bot ${userToString(
                  saved,
                )} foi enviado para a fila de aprovação.`,
              });
            });
        }
      });
    } catch (error) {
      console.error(error);
      res.render('message', {
        title: 'Erro interno',
        message: 'Ocorreu um erro interno enquanto processávamos sua solicitação, pedimos desculpas pela incoveniência.',
      });
    }
  });
  return router;
};
