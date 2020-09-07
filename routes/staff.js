const express = require("express");
const router = express.Router();
const { partialBotObject } = require("../utils/bot");
const { userToString } = require("../utils/user");
const discordBotM = require("../utils/discordbot");

module.exports = (config, db) => {
    const discordBot = discordBotM(config); 
    router.get("/bots", async (req, res) => {
        if (!req.session.user) {
            req.session.path = req.originalUrl;
            return res.redirect("/oauth2/login");
        }
        if (!req.session.user.role || req.session.user.role < 1)
            return res.sendStatus(403);
        res.render("staff/bots", {
            bots: (await db.Bots.find({approvedBy: null}).exec()).map(partialBotObject),
            bpdId: config.discord.bpdId
        });
    });

    router.get("/bots/:id/aprovar", async (req, res) => {
        if (!req.session.user) {
            req.session.path = req.originalUrl;
            return res.redirect("/oauth2/login");
        }
        if (req.session.user.id != config.discord.ownerId) {
            const user = await db.Users.findById(req.session.user.id).exec();
            if (!user || !user.details || !user.details.role || user.details.role < 1) 
                return res.sendStatus(403);
        }
        
        db.Bots.findById(req.params.id).then(bot => {
            if (!bot)
                return res.render("message", {message: "O bot não existe.", url: "/staff/bots"})
            if (bot.approvedBy)
                return res.render("message", {message: `O bot ${userToString(bot)} já está aprovado.`, url: "/staff/bots"})
            bot.approvedBy = req.session.user.id;
            bot.save();
            discordBot.sendMessage(config.discord.bot.channels.botLogs, `O bot \`${userToString(bot)}\` foi aprovado por \`${userToString(req.session.user)}\`\n` +
            `${config.server.root}bots/${bot.id}`);
            res.render("message", {title: "Sucesso", message: `O bot ${userToString(bot)} foi aprovado com sucesso.`, url: "/staff/bots"})
        });
    });
    router.get("/bots/:id/rejeitar", (req, res) => {
        if (!req.session.user) {
            req.session.path = req.originalUrl;
            return res.redirect("/oauth2/login");
        }
        if (!req.session.user.role || req.session.user.role < 1)
            return res.sendStatus(403);
        res.render("staff/reject", {id: req.params.id});
    });
    router.post("/bots/rejeitar", async (req, res) => {
        if (!req.session.user) {
            req.session.path = req.originalUrl;
            return res.redirect("/oauth2/login");
        }
        if (req.session.user.id != config.discord.ownerId) {
            const user = await db.Users.findById(req.session.user.id).exec();
            if (!user || !user.details.role || user.details.role < 1) 
                return res.sendStatus(403);
        }
        db.Bots.findById(req.body.id).then(bot => {
            if (!bot)
                return res.render("message", {message: "O bot não existe.", url: "/staff/bots"})
            if (bot.approvedBy)
                return res.render("message", {message: `O bot ${userToString(bot)} foi aprovado.`, url: "/staff/bots"})
            db.Bots.deleteOne({_id: bot.id}).exec();
            discordBot.sendMessage(config.discord.bot.channels.botLogs, `O bot \`${userToString(bot)}\` foi rejeitado por \`${userToString(req.session.user)}\`\n` + 
            `Motivo: \`${req.body.reason}\``);
            res.render("message", {title: "Sucesso", message: `O bot ${userToString(bot)} foi rejeitado com sucesso.`, url: "/staff/bots"})
        });
    });

    router.get("/edit", (req, res) => {
        if (!req.session.user) {
            req.session.path = req.originalUrl;
            return res.redirect("/oauth2/login");
        }
        
        if (!req.session.user.role || req.session.user.role < 2)
            return res.sendStatus(403);
        
        res.render("staff/edit", {roles: {nenhum: 0, aprovador: 1, administrador: 2}});
    });

    router.post("/edit", async (req, res) => {
        if (!req.session.user) {
            req.session.path = req.originalUrl;
            return res.redirect("/oauth2/login");
        }
        let perm = req.session.user.id == config.discord.ownerId ? 3 : 0;
        if (!perm) {
            const user = await db.Users.findById(req.session.user.id).exec();
            if (user && user.details)
                perm = user.details.role;
        }
        if (!perm || perm < 2 || (req.body.role == 2 && perm != 3)) 
            return res.sendStatus(403);
        
        db.Users.findByIdAndUpdate(req.body.id, {"details.role": req.body.role}).exec();
        
        res.render("message", {message: `Você alterou as permissões do usuário ${req.body.id} com sucesso.`, title: "Sucesso"})
        
    });

    return router;
}
