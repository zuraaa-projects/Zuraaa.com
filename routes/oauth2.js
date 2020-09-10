const express = require("express");
const fetch = require('node-fetch');
const router = express.Router();
const Mongo = require("../modules/mongo");
const cache = require("../utils/imageCache");
/**
 * 
 * @param {*} config 
 * @param {Mongo} mongo 
 */
module.exports = (config, mongo) => {
    router.get("/login", (req, res) => {
        res.redirect(generateUrl(config));
    });

    router.get("/callback", (req, res) => {
        const code = req.query.code;
        if(code){
            fetch(config.oauth.urls.token, {
                method: "post",
                body: new URLSearchParams({
                    client_id: config.oauth.client.id,
                    client_secret: config.oauth.client.secret,
                    grant_type: "authorization_code",
                    scope: "identify",
                    code: code,
                    redirect_uri: config.oauth.urls.redirect,
                }).toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                } 
            }).then(discordToken => discordToken.json()).then((jsonToken) => {
                fetch(config.discord.endpoints.userMe, {
                    method: "get",
                    headers: {
                        "Authorization": `Bearer ${jsonToken.access_token}`
                    } 
                }).then(discordUser => discordUser.json()).then(async (jsonUser) => {
                    req.session.user = jsonUser;
                    const x = await saveData(jsonUser);
                    req.session.user.role = x.id == config.discord.ownerId ? 3 : x.details.role;
                    req.session.save();
                    res.redirect(req.session.path || "/");
                });
            });
        }else{
            res.redirect("/oauth2/login");
        }
    });

    router.get("/logout", (req, res) => {
        req.session.destroy();
        res.redirect("/");
    })


    function generateUrl(){
        return `${config.oauth.urls.authorization}?client_id=${config.oauth.client.id}`
        + `&redirect_uri=${encodeURIComponent(config.oauth.urls.redirect)}&response_type=code&scope=identify`;
    }

    async function saveData(user){
        const userFind = await cache(config).saveCached(await mongo.Users.findById(user.id).exec())
        if(userFind){
            userFind.username = user.username;
            userFind.discriminator = user.discriminator;
            userFind.avatar = user.avatar;
        }else{
            userFind = new mongo.Users({
                _id: user.id,
                username: user.username,
                discriminator: user.discriminator,
                avatar: user.avatar
            });
        }
        userFind.save();
        return userFind;
    }

    return router;
}