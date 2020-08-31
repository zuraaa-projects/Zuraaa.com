const express = require("express");
const router = express.Router();
const tags = require("../utils/tags");
const bot = require("../utils/discordbot");
const { userToString } = require("../utils/user");
const md = require("markdown-it")();
const libraries = require("../utils/libraries");
const { getCaptchaResponse } = require("../utils/captcha");

module.exports = (config, db) => {
    const dBot = bot(config);
    router.get("/", (req, res) => {
        res.render("index", {title: "Bots"});
    });
    
    router.get("/add", (req, res) => {
        if (!req.session.user) 
            return res.redirect("/oauth2/login");
        res.render("bots/add", {tags, title: "Adicionar Bot", libraries})
    });
    
    router.post("/add", async (req, res) => {
        if (!req.session.user) 
            return res.redirect("/oauth2/login");
        const b = req.body;
        if (!((await getCaptchaResponse(config.recaptcha.secret, b["g-recaptcha-response"])).success))
            return res.render("message", {message: "O Captcha precisa ser validado.", url: req.originalUrl});
        const allTags = Object.keys(tags);
        const botTags = [...new Set(typeof b.tags == "string" ? [b.tags] : b.tags)];
        const owners = typeof b.owners == "string" ? [b.owners] : b.owners;
        if (isNaN(b.id) || b.id.length != 18 ||
            (owners && owners.some(o => isNaN(o) || o.length != 18)) ||
            !b.library || !libraries.includes(b.library) ||
            (b.support && b.support.length > 2083) ||
            (b.custominvite && b.custominvite.length > 2083) ||
            !b.prefix || b.prefix.length > 15 ||
            !b.shortdesc || b.shortdesc.length < 2 || b.shortdesc.length > 300 ||
            (b.longdesc && b.longdesc.length > 10000) ||
            !botTags.length || botTags.length > 6 || botTags.some(t => !allTags.includes(t))
        )
            return res.render("message", {message: "Algo de errado não está certo.", url: req.originalUrl});
        
        dBot.fetchUser(b.id).then(user => {
            if (!user)
                return res.render("message", {message: "O ID fornecido é inválido.", url: req.originalUrl});
            
            if (!user.bot)
                return res.render("message", {
                    message: `O ID fornecido pertence a ${userToString(user)}, que não é um bot.`,
                    url: req.originalUrl
                });
            
            db.Bots.findById(b.id).exec().then(async dbUser => {
                if (dbUser)
                    return res.render("message", {
                        message: `O ID fornecido pertence a ${userToString(user)}, que já está cadastrado no sistema.`,
                        url: req.originalUrl
                    });
                if (owners.size) {
                    const ownlist = [...owners];
                    const query = await db.Users.find({_id: {$in: ownlist}});
                    const diff = ownlist.filter(x => !query.some(y => y._id === x));
                    
                    if (diff.length > 0) {
                        return res.render("message", {
                            message: diff.length == 1 ?
                                `O dono de ID ${diff[0]} precisa fazer login no site ao menos 1 vez para poder ser adicionado.` :
                                `Os donos de ID ${diff.join(", ")} precisam fazer login no site ao menos 1 vez para poderem ser adicionados.`,
                            url: req.originalUrl
                        })
                    }
                }
                
                const dbBot = new db.Bots({
                    _id: b.id,
                    username: user.username,
                    discriminator: user.discriminator,
                    avatar: user.avatar,
                    owner: req.session.user.id,
                    status: "online", // alterar
                    dates: {
                        sent: Date.now()
                    },
                    details: {
                        prefix: b.prefix,
                        tags: botTags,
                        library: b.library,
                        shortDescription: b.shortdesc,
                        longDescription: b.longdesc,
                        htmlDescription: md.render(b.longdesc),
                        otherOwners: owners,
                        website: b.website,
                        supportServer: b.server
                    }
                });
                dbBot.save();
                dBot.sendMessage(config.discord.bot.channels.botLogs, "<@"+ req.session.user.id + "> enviou o bot **`" + userToString(user)
                + "`** (" + b.id + ") para a aprovação.")
                
                res.render("message", {title: "Sucesso", message: `O bot ${userToString(user)} foi enviado para a fila de aprovação.`})
            });
                
        });
        
        
    });
    return router;
}