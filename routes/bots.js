const express = require("express");
const router = express.Router();
const tags = require("../utils/tags");
const bot = require("../utils/discordbot");
const { userToString } = require("../utils/user");
const md = require("markdown-it")();
const libraries = require("../utils/libraries");
const { captchaIsValid } = require("../utils/captcha");

module.exports = (config, db) => {
  const dBot = bot(config);
  router.get("/", (req, res) => {
    res.render("index", { title: "Bots" });
  });

  router.get("/add", (req, res) => {
    if (!req.session.user) return res.redirect("/oauth2/login");
    res.render("bots/add", { tags, title: "Adicionar Bot", libraries });
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
      console.log(owners)
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
