const express = require('express');

const router = express.Router();
const validUrl = require('valid-url');
const md = require('markdown-it')();
const tags = require('../utils/tags');
const bot = require('../utils/discordbot');
const httpExtensions = require('../utils/httpExtensions');
const { userToString } = require('../utils/user');
const libraries = require('../utils/libraries');
const { captchaIsValid } = require('../utils/captcha');
const cache = require('../utils/imageCache');
const colors = require('../utils/colors');
const { partialBotObject, partialSelect } = require('../utils/bot');

function defaultInvite(id) {
  return `https://discord.com/api/v6/oauth2/authorize?client_id=${id}&scope=bot`;
}

/**
 *
 * @param {*} config
 * @param {Mongo} db
 */
module.exports = (config, db) => {
  const dBot = bot(config);

  async function getBotBy(idOrName) {
    return db.Bots.findOne({
      $or: [{ _id: idOrName }, { 'details.customURL': idOrName }],
    }).exec();
  }

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

  function saveBot(b, botUser, userId, owners, botTags, botModel, servidores) {
    botModel.username = botUser.username;
    botModel.discriminator = botUser.discriminator;
    botModel.avatar = botUser.avatar;
    botModel.owner = userId;
    botModel.webhook.url = b.webhook;
    botModel.webhook.authorization = b.authorization;
    botModel.status = 'online'; // alterar
    botModel.details = botModel.details || {};
    botModel.details.prefix = b.prefix;
    botModel.details.tags = botTags;
    botModel.details.customInviteLink = b.custominvite;
    botModel.details.library = b.library;
    botModel.details.shortDescription = b.shortdesc;
    botModel.details.longDescription = b.longdesc;
    botModel.details.htmlDescription = md.render(b.longdesc);
    botModel.details.otherOwners = owners.filter((owner) => owner !== userId);
    botModel.details.website = b.website;
    botModel.details.supportServer = b.server;
    if (config.discord.atualizarServidores) {
      botModel.details.guilds = servidores;
    }

    cache(config).saveCached(botModel).then((dbBot) => dbBot.save());
  }
  function stringToArray(string) {
    return [
      ...new Set(typeof string === 'string' ? [string] : string || []),
    ];
  }

  router.get('/', (req, res) => {
    let { page } = req.query;
    if (!page || Number.isNaN(page) || page < 1) { page = 1; }
    const params = {};
    const { search } = req.query;
    if (search) {
      const regex = { $regex: search, $options: 'i' };
      params.$or = [{ username: regex }, { 'details.shortDescription': regex }];
    }
    params.$and = [{ approvedBy: { $ne: null } }];
    db.Bots.find(params).sort({ 'dates.sent': -1 }).select(partialSelect).limit(18)
      .skip((page - 1) * 18)
      .setOptions({
        allowDiskUse: true,
      })
      .exec()
      .then((bots) => {
        res.render('bots/bots', {
          title: 'Bots', page, search, bots: (bots || []).map(partialBotObject),
        });
      });
  });

  router.get('/:id', (req, res) => {
    if (req.params.id === 'add') {
      if (!req.session.user) {
        req.session.path = req.originalUrl;
        res.redirect('/oauth2/login');
        return;
      }
      res.render('bots/add', {
        tags, title: 'Adicionar Bot', libraries, captcha: config.recaptcha.public,
      });
      return;
    }

    db.Bots.findOne({
      $or: [{ _id: req.params.id }, { 'details.customURL': req.params.id }],
    }).populate('owner', '_id username discriminator avatarBuffer').populate('details.otherOwners', '_id username discriminator avatarBuffer').exec()
      .then(async (dbot) => {
        if (dbot != null) {
          if (!dbot || !dbot.approvedBy) {
            if (!req.session.user) {
              res.sendStatus(404);
              return;
            }
            const user = await db.Users.findById(req.session.user.id).exec();
            if (!user || !user.details.role || user.details.role < 1) {
              res.sendStatus(404);
              return;
            }
          }

          if (!dbot.details.htmlDescription) {
            dbot.details.htmlDescription = md.render(dbot.details.longDescription);
          }
          /*
                        eh serio vei
                        eh impossivel adicionar ou fazer manutenção nessa porra
                        so n da, n da pra entender nada
                        eu desejo morte a os envolvidos que fizerem isso
                        enquanto isso eu choro
                        tentanto achar onde eu faço essa merda atualizar
                        pf alguem me ajuda
                        eu peço que deus me ajuda com o doçe abraço da morte
                        eu nem sei como essa merda de codigo ainda funciona
                        me impressiono todo dia q ele n pego fogo
                    */
          if (config.discord.atualizarServidores) {
            dbot.details.guilds = await httpExtensions(config).pegarServidores(dbot._id);
          }
          cache(config).saveCached(dbot).then((element) => {
            element.save();
            const botTags = dbot.details.tags;
            const avatarUrl = (typeof element.avatarBuffer.data === 'string') ? Buffer.from(element.avatarBuffer.data).toString('base64') : element.avatarBuffer.data;
            const owners = [...(dbot.details.otherOwners || []), dbot.owner].filter(
              (x, index, self) => self.findIndex((y) => y.id === x.id) === index,
            );

            owners.forEach((o) => {
              o.avatarBuffer.data = (typeof element.avatarBuffer.data === 'string') ? Buffer.from(o.avatarBuffer.data).toString('base64') : o.avatarBuffer.data;
            });
            res.render(`bots/bot${req.query.frame ? 'frame' : ''}`, {
              bot: {
                avatar: `data:${element.avatarBuffer.contentType};base64, ${avatarUrl}`,
                name: dbot.username,
                tag: dbot.discriminator,
                bio: dbot.details.shortDescription,
                votes: dbot.votes.current,
                tags: botTags,
                content: dbot.details.htmlDescription,
                url: `/bots/${dbot.details.customURL || dbot.id}/`,
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
              user: req.session.user,
            });
          });
        } else {
          res.sendStatus(404);
        }
      });
  });

  router.get('/:id/add', (req, res) => {
    getBotBy(req.params.id).then((dbot) => {
      if (!dbot) {
        res.sendStatus(404);
        return;
      }
      res.redirect(dbot.details.customInviteLink || defaultInvite(dbot.id));
    });
  });

  router.get('/:id/votar', (req, res) => {
    if (!req.session.user) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    getBotBy(req.params.id).then((dbot) => {
      cache(config).saveCached(dbot).then((element) => {
        element.save();
        res.render('bots/votar', { captcha: config.recaptcha.public, title: `Vote em ${dbot.username}`, bot: { name: dbot.username, avatar: `data:${element.avatarBuffer.contentType};base64, ${element.avatarBuffer.data}` } });
      });
    });
  });

  router.post('/:id/votar', async (req, res) => {
    if (!req.session.user) {
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
    db.Users.findById(req.session.user.id).then((user) => {
      if (user) {
        const next = user.dates.nextVote;
        const now = new Date();
        if (next && next > now) {
          let time = `${next.getHours().toString().padStart(2, 0)}h`;
          const minutes = next.getMinutes();
          if (minutes) {
            time += `${minutes.toString().padStart(2, 0)}min`;
          }
          res.render('message', {
            message: `Você precisa esperar até ás ${time} para poder votar novamente.`,
          });
          return;
        }
        getBotBy(req.params.id).then((dot) => {
          if (!dot) {
            res.sendStatus(404);
            return;
          }
          now.setHours(now.getHours() + 8);
          user.dates.nextVote = now;
          user.save();
          dot.votes.current += 1;
          dot.votes.voteslog.push(user.id);
          dot.save();
          dBot.sendMessage(config.discord.bot.channels.botLogs, `${userToString(user)} (${user.id}) votou no bot \`${userToString(dot)}\`\n`
                        + `${config.server.root}bots/${dot.details.customURL || dot.id}`);
          res.render('message', {
            title: 'Sucesso',
            message: `Você votou em ${dot.username} com sucesso.`,
          });
        });
      }
    });
  });

  router.get('/:id/editar', (req, res) => {
    if (!req.session.user) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    getBotBy(req.params.id).then((dbot) => {
      if (!dbot) {
        res.sendStatus(404);
        return;
      }
      if (!([...dbot.details.otherOwners, dbot.owner].includes(req.session.user.id))) {
        res.sendStatus(403);
        return;
      }
      res.render('bots/editar', {
        bot: dbot, libraries, tags, captcha: config.recaptcha.public,
      });
    });
  });

  router.post('/editar', (req, res) => {
    if (!req.session.user) {
      req.session.path = req.originalUrl;
      res.redirect('/oauth2/login');
      return;
    }
    getBotBy(req.body.id).then((dbot) => {
      if (!dbot) {
        res.sendStatus(404);
        return;
      }
      const botTags = stringToArray(req.body.tags);
      const owners = stringToArray(req.body.owners);
      validateForm(req.body, req, res, botTags, owners).then(async (result) => {
        if (result) {
          if (!([...dbot.details.otherOwners, dbot.owner].includes(req.session.user.id))) {
            res.sendStatus(403);
            return;
          }
          saveBot(req.body, {
            username: dbot.username,
            discriminator: dbot.discriminator,
          }, dbot.owner,
          owners,
          botTags,
          dbot,
          config.discord.atualizarServidores ? (
            await (httpExtensions(config)).pegarServidores(dbot.id)
          ) : null);
          const url = dbot.details.customURL || dbot.id;
          dBot.sendMessage(config.discord.bot.channels.botLogs,
            `\`${userToString(req.session.user)}\` editou o bot **\`${userToString(dbot)}\`** (${dbot.id}).\n`
                        + `${config.server.root}bots/${url}`);
          res.render('message', { message: `Você editou o bot ${userToString(dbot)} com sucesso.`, title: 'Sucesso', url: `/bots/${url}` });
        }
      });
    });
  });

  router.post('/add', async (req, res) => {
    try {
      if (!req.session.user) {
        req.session.path = req.originalUrl;
        res.redirect('/oauth2/login');
        return;
      }
      const b = req.body;
      const botTags = stringToArray(b.tags);
      const owners = stringToArray(b.owners);
      validateForm(b, req, res, botTags, owners).then((result) => {
        if (result) {
          dBot.fetchUserDiscord(b.id).then((user) => {
            if (!user) {
              res.render('message', {
                message: 'O ID fornecido é inválido.',
                url: req.originalUrl,
              });
              return;
            }

            if (!user.bot) {
              res.render('message', {
                message: `O ID fornecido pertence a ${userToString(
                  user,
                )}, que não é um bot.`,
                url: req.originalUrl,
              });
              return;
            }
            db.Bots.findById(b.id)
              .exec()
              .then(async (dbUser) => {
                if (dbUser) {
                  res.render('message', {
                    message: `O ID fornecido pertence a ${userToString(
                      user,
                    )}, que já está cadastrado no sistema.`,
                    url: req.originalUrl,
                  });
                  return;
                }

                dBot.sendMessage(config.discord.bot.channels.botLogs, `\`${userToString(req.session.user)}\` enviou o bot **\`${userToString(user)}\`** (${b.id}) para a aprovação. <@&${config.discord.bot.roles.verifier}>`);
                dBot.sendMessageDm(req.session.user.id, {
                  title: 'O seu bot foi enviado para aprovação',
                  color: 0xfbff00,
                  description: `O seu bot \`${userToString(user)}\` foi para a fila de aprovação`,
                });
                saveBot(
                  b,
                  user,
                  req.session.user.id,
                  owners,
                  botTags,
                  new db.Bots({ _id: b.id }),
                  config.discord.atualizarServidores
                    ? await httpExtensions(config).pegarServidores(b.id)
                    : null,
                );
                res.render('message', {
                  title: 'Sucesso',
                  message: `O bot ${userToString(
                    user,
                  )} foi enviado para a fila de aprovação.`,
                });
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
