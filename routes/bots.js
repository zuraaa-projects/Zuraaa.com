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
const controller = require("../api/websocket");
const { payloadToJson, opcodes } = require("../api/websocket/util/payload");
const { eventsCode } = require("../api/websocket/util/events");

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
      if (!req.session.user) return res.redirect("/oauth2/login");
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
              owners: [...dbot.details.otherOwners, dbot.owner],
              prefix: dbot.details.prefix,
              library: dbot.details.library
            },
            title: dbot.username,
            colors,
            tags: tags
          });
        });

      })
  });
  router.get("/:id/:action", (req, res) => {
    db.Bots.findOne({
      $or: [{ _id: req.params.id }, { "details.customURL": req.params.id }]
    }).exec().then(dbot => {

      if (!dbot)
        return res.sendStatus(404);
      switch (req.params.action) {
        case "add":
          res.redirect(dbot.details.customInviteLink || defaultInvite(dbot.id));
          break;
        case "votar":
          cache(config).saveCached(dbot).then(element => {
            element.save();
            if (!req.session.user) return res.redirect("/oauth2/login");
            res.render("bots/votar", { title: `Vote em ${dbot.username}`, bot: { name: dbot.username, avatar: `data:${element.avatarBuffer.contentType};base64, ${element.avatarBuffer.data}` } });
          });
          break;
        default:
          res.sendStatus(404);
          break;
      }
    });
  });
  router.post("/:id/votar", async (req, res) => {
    if (!req.session.user) return res.redirect("/oauth2/login");
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
      db.Bots.findOne({ $or: [{ _id: req.params.id }, { "details.customURL": req.params.id }] }).then(dot => {
        if (!dot)
          return res.sendStatus(404);
        now.setHours(now.getHours() + 8);
        // user.dates.nextVote = now;
        user.save();
        dot.votes.current++;
        dot.save();
        dBot.sendMessage(config.discord.bot.channels.botLogs, `${userToString(user)} (${user.id}) votou no bot \`${userToString(dot)}\``)
        res.render("message", {
          title: "Sucesso",
          message: `Você votou em ${dot.username} com sucesso.`
        });
        controller.broadcast(payloadToJson({ op: opcodes.Dispatch, data: { bot: dot._id, votes: dot.votes.current, user: user._id }, event: eventsCode.BOT_VOTE_ADD }))
      });
    }
  });
  router.post("/add", async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/oauth2/login");
      const b = req.body;
      if (!(await captchaIsValid(config.recaptcha, b["g-recaptcha-response"])))
        return res.render("message", {
          message: "O Captcha precisa ser validado.",
          url: req.originalUrl,
        });
      const allTags = Object.keys(tags);
      const botTags = [
        ...new Set(typeof b.tags == "string" ? [b.tags] : b.tags),
      ];
      const owners = typeof b.owners == "string" ? [b.owners] : b.owners;
      {
        if (!owners || owners.some((o) => isNaN(o) || o.length != 18))
          return res.render("message", {
            message: "Lista de donos inválida.",
            url: req.originalUrl,
          });

        if (isNaN(b.id) || b.id.length != 18)
          return res.render("message", {
            message: "ID do bot fornecido é inválido.",
            url: req.originalUrl,
          });
        if (!b.library || !libraries.includes(b.library))
          return res.render("message", {
            message: "Biblioteca fornecida é inválida.",
            url: req.originalUrl,
          });
        if (b.support && b.support.length > 2083)
          return res.render("message", {
            message: "Link do servidor de suporte é inválido.",
            url: req.originalUrl,
          });
        if (!b.prefix || b.prefix.length > 15)
          return res.render("message", {
            message: "Prefixo do bot é inválido.",
            url: req.originalUrl,
          });
        if (!b.shortdesc || b.shortdesc.length < 2 || b.shortdesc.length > 300)
          return res.render("message", {
            message: "Descrição curta é inválida.",
            url: req.originalUrl,
          });
        if (b.longdesc && b.longdesc.length > 10000)
          return res.render("message", {
            message: "Descrição longa é inválida.",
            url: req.originalUrl,
          });
        if (
          !botTags.length ||
          botTags.length > 6 ||
          botTags.some((t) => !allTags.includes(t))
        )
          return res.render("message", {
            message: "Tags do bot é/são inválida(s).",
            url: req.originalUrl,
          });
      }

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
            const query = await db.Users.find({ _id: { $in: owners } });
            const diff = owners.filter((x) => !query.some((y) => y._id === x));

            if (diff.length > 0) {
              return res.render("message", {
                message:
                  diff.length == 1
                    ? `O dono de ID ${diff[0]} precisa fazer login no site ao menos 1 vez para poder ser adicionado.`
                    : `Os donos de ID ${diff.join(
                      ", "
                    )} precisam fazer login no site ao menos 1 vez para poderem ser adicionados.`,
                url: req.originalUrl,
              });
            }

            const dbBot = new db.Bots({
              _id: b.id,
              username: user.username,
              discriminator: user.discriminator,
              avatar: user.avatar,
              owner: req.session.user.id,
              status: "online", // alterar
              dates: {
                sent: Date.now(),
              },
              details: {
                prefix: b.prefix,
                tags: botTags,
                library: b.library,
                shortDescription: b.shortdesc,
                longDescription: b.longdesc,
                htmlDescription: md.render(b.longdesc),
                otherOwners: owners.filter(owner => owner != req.session.user.id),
                website: b.website,
                supportServer: b.server,
              },
            });
            dbBot.save();
            dBot.sendMessage(
              config.discord.bot.channels.botLogs,
              "<@" +
              req.session.user.id +
              "> enviou o bot **`" +
              userToString(user) +
              "`** (" +
              b.id +
              ") para a aprovação."
            );

            res.render("message", {
              title: "Sucesso",
              message: `O bot ${userToString(
                user
              )} foi enviado para a fila de aprovação.`,
            });
          });
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
  return router;
};
