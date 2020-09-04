const express = require("express");
const fetch = require('node-fetch');
const router = express.Router();
const Mongo = require("../modules/mongo");
const cache = require("../utils/imageCache");
const { fullUrl } = require("../utils/url");
const config = require('../config.json');
/**
 * 
 * @param {*} config 
 * @param {Mongo} mongo 
 */
module.exports = (mongo) => {
    router.get("/login", (req, res) => {
        res.redirect(generateUrl(config));
    });

    router.get("/callback", (req, res) => {
        let code = req.query.code;
        if (code) {
            fetch(config.oauth.urls.token, {
                method: "post",
                body: `client_id=${config.oauth.client.id}&client_secret=${config.oauth.client.secret}&grant_type=authorization_code&
                scope=identify&code=${code}&redirect_uri=${encodeURIComponent(config.oauth.urls.redirect)}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(discordToken => discordToken.json()).then((jsonToken) => {
                fetch(config.discord.endpoints.userMe, {
                    method: "get",
                    headers: {
                        "Authorization": `Bearer ${jsonToken.access_token}`
                    }
                }).then(discordUser => discordUser.json()).then((jsonUser) => {
                    req.session.user = jsonUser;
                    req.session.save();

                    saveData(jsonUser);

                    if (!req.cookies['redirectPage'])
                        res.redirect("/");
                    else
                        res.redirect(req.cookies['redirectPage']);
                });
            });
        } else {
            res.redirect("/oauth2/login");
        }
    });

    router.get("/logout", (req, res) => {
        req.session.destroy();
        res.redirect("/");
    })



    function saveData(user) {
        mongo.Users.findById(user.id).exec().then((userFind) => {
            if (userFind) {
                userFind.username = user.username;
                userFind.discriminator = user.discriminator;
                userFind.avatar = user.avatar;
            } else {
                userFind = new mongo.Users({
                    _id: user.id,
                    joined_at: Date.now(),
                    username: user.username,
                    discriminator: user.discriminator,
                    avatar: user.avatar,
                    permissions: []
                });
            }
            cache(config).saveCached(userFind).then(element => {
                element.save();
            });
        });

    }

    return router;
}

module.exports.isAuthenticated = (req, res) => {
    if (req.session.user)
        return true;

    res.cookie('redirectPage', fullUrl(req) + '', { expires: new Date(Date.now() + 2 * 60 * 100) });
    res.redirect(generateUrl());
    return false;
}

function generateUrl() {
    return `${config.oauth.urls.authorization}?client_id=${config.oauth.client.id}`
        + `&redirect_uri=${encodeURIComponent(config.oauth.urls.redirect)}&response_type=code&scope=identify`;
}