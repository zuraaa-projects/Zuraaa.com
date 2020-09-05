const express = require("express");
const router = express.Router();
const tags = require("../utils/tags");
const bot = require("../utils/discordbot");
const { userToString, avatarFormat } = require("../utils/user");
const md = require("markdown-it")();
const libraries = require("../utils/libraries");
const { captchaIsValid } = require("../utils/captcha");
const Mongo = require("../modules/mongo");
const cache = require("../utils/imageCache");
const colors = require("../utils/colors");

const { partialBotObject } = require("../utils/bot");
const controller = require("./api/websocket");
const { payloadToJson, opcodes } = require("./api/websocket/util/payload");
const { eventsCode } = require("./api/websocket/util/events");
const { isAuthenticated } = require("./oauth2");

function defaultInvite(id) {
  return `https://discord.com/api/v6/oauth2/authorize?client_id=${id}&scope=bot`
}

/**
 * 
 * @param {*} config 
 * @param {Mongo} db 
 */
module.exports = (config, db) => {
  const dBot = bot(config);
  // router.get("/test", (req, res) => {
  //   db.Bots.find({$or: [{"owner.avatarBuffer": null}, {"owner.avatarBuffer": null}]}).populate("owner", "_id avatar avatarBuffer").populate("details.otherOwners", "_id avatar avatarBuffer").exec().then(dabot => { 
  //     for (b of dabot) {
  //     const owners = [...(b.otherOwners || []), b.owner];
  //     for (let i = 0; i < owners.length; i++) {
  //       const dbot = owners[i];
  //       if (dbot && !(dbot.avatarBuffer && dbot.avatarBuffer.data)) {
  //         setTimeout(() => {
  //           cache(config).saveCached(dbot).then(element => {
  //             element.save();
  //             console.log(element.id);
  //           })}, (i+1)*1000);
  //       }
  //     }
  // for (let i = 0; i < dabot.length; i++) {
  //   const dbot = dabot[i];
  //   setTimeout(() => {
  //   cache(config).saveCached(dbot).then(element => {
  //     element.save();
  //     console.log(element.id);
  //   })}, (i+1)*1000);
  // }
  // });
  //   res.sendStatus(200);
  // })
  // router.get("/reset", (req, res) => {
  //   db.Bots.updateMany({}, {"votes.current": 0}).exec();
  //   res.sendStatus(200);
  // })
  router.get("/", (req, res) => {
    let page = req.query.page;
    if (!page || isNaN(page) || page < 1)
      page = 1
    const params = {};
    const search = req.query.search;
    if (search) {
      const regex = { $regex: search, $options: "i" };
      params.$or = [{ username: regex }, { "details.shortDescription": regex }];
    }
    db.Bots.find(params).limit(18).skip((page - 1) * 18).exec().then(bots => {
      res.render("bots/bots", { title: "Bots", page, search, bots: (bots || []).map(partialBotObject) });
    });
  });
  router.get("/:id", (req, res) => {
    if (req.params.id == "add") {
      if (!isAuthenticated(req, res))
        return;
      return res.render("bots/add", { tags, title: "Adicionar Bot", libraries });
    }
    db.Bots.findOne({
      $or: [{ _id: req.params.id }, { "details.customURL": req.params.id }]
    }).populate("owner", "_id username discriminator avatarBuffer")
      .populate("details.otherOwners", "_id username discriminator avatarBuffer").exec().then(dbot => {
        if (!dbot)
          return res.sendStatus(404);

        if (!dbot.details.htmlDescription) {
          dbot.details.htmlDescription = md.render(dbot.details.longDescription);
        }

        cache(config).saveCached(dbot).then(element => {
          element.save();
          const botTags = Object.keys(tags).filter(k => dbot.details.tags.includes(tags[k]));
          res.render("bots/bot" + (req.query.frame ? "frame" : ""), {
            bot: {
              avatar: `data:${element.avatarBuffer.contentType};base64, ${element.avatarBuffer.data}`,
              name: dbot.username,
              tag: dbot.discriminator,
              bio: dbot.details.shortDescription,
              tags: botTags,
              content: dbot.details.htmlDescription,
              url: `/bots/${dbot.details.customURL || dbot.id}/`,
              support: dbot.details.supportServer,
              website: dbot.details.website,
              owners: [...dbot.details.otherOwners, dbot.owner].filter(
                (x, index, self) =>
                  self.findIndex(y => y.id == x.id) == index
              ),
              prefix: dbot.details.prefix,
              library: dbot.details.library
            },
            title: dbot.username,
            colors,
            tags,
            user: req.session.user
          });
        });

      })
  });
  router.get("/:id/add", (req, res) => {
    getBotBy(req.params.id).then(dbot => {
      if (!dbot)
        return res.sendStatus(404);
      res.redirect(dbot.details.customInviteLink || defaultInvite(dbot.id));
    })
  });

  router.get("/:id/votar", (req, res) => {
    getBotBy(req.params.id).then(dbot => {
      cache(config).saveCached(dbot).then(element => {
        element.save();
        if (!isAuthenticated(req, res))
          return;
        res.render("bots/votar", { title: `Vote em ${dbot.username}`, bot: { name: dbot.username, avatar: `data:${element.avatarBuffer.contentType};base64, ${element.avatarBuffer.data}` } });
      });
    });
  });

  router.post("/:id/votar", async (req, res) => {
    if (!isAuthenticated(req, res))
      return;
    if (!(await captchaIsValid(config.recaptcha, req.body["g-recaptcha-response"])))
      return res.render("message", {
        message: "O Captcha precisa ser validado.",
        url: req.originalUrl,
      });
    const user = await db.Users.findById(req.session.user.id);
    if (user) {
      const next = user.dates.nextVote;
      const now = new Date();
      if (next && next > now)
        return res.render("message", {
          message: `Você precisa esperar até ${next.getHours()}:${next.getMinutes()} para poder votar novamente.`
        });
      getBotBy(req.params.id).then(dot => {
        if (!dot)
          return res.sendStatus(404);
        now.setHours(now.getHours() + 8);
        user.dates.nextVote = now;
        user.save();
        dot.votes.current++;
        dot.save();
        dBot.sendMessage(config.discord.bot.channels.botLogs, `${userToString(user)} (${user.id}) votou no bot \`${userToString(dot)}\`\n` +
          `${config.server.root}bots/${dot.details.customURL || dot.id}`);
        res.render("message", {
          title: "Sucesso",
          message: `Você votou em ${dot.username} com sucesso.`
        });
      });
    }
  });

  router.get("/:id/editar", (req, res) => {
    if (!req.session.user) return res.redirect("/oauth2/login");
    getBotBy(req.params.id).then(dbot => {
      if (!dbot) return res.sendStatus(404);
      if (!([...dbot.details.otherOwners, dbot.owner].includes(req.session.user.id)))
        return res.sendStatus(403);
      res.render("bots/editar", { bot: dbot, libraries, tags });
    });
  });

  router.post("/editar", (req, res) => {
    if (!req.session.user) return res.redirect("/oauth2/login");
    getBotBy(req.body.id).then(dbot => {
      if (!dbot)
        return res.sendStatus(404);
      const botTags = stringToArray(req.body.tags);
      const owners = stringToArray(req.body.owners);
      validateForm(req.body, config, req, res, botTags, owners).then(result => {
        if (result) {
          if (!([...dbot.details.otherOwners, dbot.owner].includes(req.session.user.id)))
            return res.sendStatus(403);
          saveBot(req.body, {
            username: dbot.username,
            discriminator: dbot.discriminator
          }, dbot.owner, owners, botTags, dbot);
          dBot.sendMessage(config.discord.bot.channels.botLogs,
            `\`${userToString(req.session.user)}\` editou o bot **\`${userToString(dbot)}\`** (${dbot.id}).\n` +
            `${config.server.root}bots/${dbot.details.customURL || dbot.id}`);
          res.render("message", { message: `Você editou o bot ${userToString(dbot)} com sucesso.`, title: "Sucesso" })
        }
      });
    });
  })

  router.post("/add", async (req, res) => {
    try {
      if (!isAuthenticated(req, res))
        return;
      const b = req.body;
      const botTags = stringToArray(b.tags);
      const owners = stringToArray(b.owners);
      validateForm(b, config, req, res, botTags, owners).then(result => {
        if (result) {
          dBot.fetchUser(b.id).then((user) => {
            if (!user)
              return res.render("message", {
                message: "O ID fornecido é inválido.",
                url: req.originalUrl,
              });

            if (!user.bot)
              return res.render("message", {
                message: `O ID fornecido pertence a ${userToString(
                  user
                )}, que não é um bot.`,
                url: req.originalUrl,
              });
            db.Bots.findById(b.id)
              .exec()
              .then(async (dbUser) => {
                if (dbUser)
                  return res.render("message", {
                    message: `O ID fornecido pertence a ${userToString(
                      user
                    )}, que já está cadastrado no sistema.`,
                    url: req.originalUrl,
                  });

                dBot.sendMessage(
                  config.discord.bot.channels.botLogs,
                  `\`${userToString(req.session.user)}\` enviou o bot **\`${userToString(user)}\`** (${b.id}) para a aprovação. <@&550700674422276096>`
                );
                saveBot(b, user, req.session.user.id, owners, botTags, new db.Bots({ _id: b.id }));
                res.render("message", {
                  title: "Sucesso",
                  message: `O bot ${userToString(
                    user
                  )} foi enviado para a fila de aprovação.`,
                });
              });
          });
        }
      });

    } catch (error) {
      console.error(error);
      return res.render("message", {
        title: "Erro interno",
        message:
          "Ocorreu um erro interno enquanto processávamos sua solicitação, pedimos desculpas pela incoveniência.",
      });
    }
  });
  async function getBotBy(idOrName) {
    return await db.Bots.findOne({
      $or: [{ _id: idOrName }, { "details.customURL": idOrName }]
    }).exec();
  }

  async function validateForm(body, config, req, res, botTags, owners) {
    if (!(await captchaIsValid(config.recaptcha, body["g-recaptcha-response"]))) {
      res.render("message", {
        message: "O Captcha precisa ser validado.",
        url: req.originalUrl,
      });
      return false;
    }
    if (owners && owners.some((o) => isNaN(o) || o.length != 18)) {
      res.render("message", {
        message: "Lista de donos inválida.",
        url: req.originalUrl,
      });
      return false;
    }
    if (isNaN(body.id) || body.id.length != 18) {
      res.render("message", {
        message: "ID do bot fornecido é inválido.",
        url: req.originalUrl,
      });
      return false;
    }
    if (!body.library || !libraries.includes(body.library)) {
      res.render("message", {
        message: "Biblioteca fornecida é inválida.",
        url: req.originalUrl,
      });
      return false;
    }

    if (body.support && body.support.length > 2083) {
      res.render("message", {
        message: "Link do servidor de suporte é inválido.",
        url: req.originalUrl,
      });
      return false;
    }
    if (!body.prefix || body.prefix.length > 15) {
      res.render("message", {
        message: "Prefixo do bot é inválido.",
        url: req.originalUrl,
      });
      return false;
    }
    if (!body.shortdesc || body.shortdesc.length < 2 || body.shortdesc.length > 300) {
      res.render("message", {
        message: "Descrição curta é inválida.",
        url: req.originalUrl,
      });
      return false;
    }
    if (body.longdesc && body.longdesc.length > 10000) {
      res.render("message", {
        message: "Descrição longa é inválida.",
        url: req.originalUrl,
      });
      return false;
    }
    const allTags = Object.keys(tags);
    if (
      !botTags.length ||
      botTags.length > 6 ||
      botTags.some((t) => !allTags.includes(t))
    ) {
      res.render("message", {
        message: "Tags do bot é/são inválida(s).",
        url: req.originalUrl,
      });
      return false;
    }
    return true;
  }

  function saveBot(b, botUser, userId, owners, botTags, bot) {
    bot.username = botUser.username;
    bot.discriminator = botUser.discriminator;
    bot.avatar = botUser.avatar;
    bot.owner = userId;
    bot.status = "online"; // alterar
    bot.dates.sent = Date.now();
    bot.details = {
      prefix: b.prefix,
      tags: botTags,
      library: b.library,
      shortDescription: b.shortdesc,
      longDescription: b.longdesc,
      htmlDescription: md.render(b.longdesc),
      otherOwners: owners.filter(owner => owner != userId),
      website: b.website,
      supportServer: b.server
    }
    cache(config).saveCached(bot).then(dbBot => dbBot.save());
  }
  return router;
};

function stringToArray(string) {
  return [
    ...new Set(typeof string == "string" ? [string] : string || []),
  ];
}