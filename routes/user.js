const express = require('express');
const router = express.Router();
const Mongo = require('../modules/mongo');
const {avatarFormat} = require("../utils/user");
const {partialBotObject} = require("../utils/bot");

/**
 * 
 * @param {Mongo} mongo 
 */
module.exports = (mongo) => {
    router.get('/:userId', (req, res) => {
        mongo.Users.findById(req.params.userId).exec().then(async (user) => {
            user ? res.render("user", {
                user: {
                    avatar: avatarFormat(user),
                    name: user.username,
                    tag: user.discriminator
                },
                bots: (await mongo.Bots.find().or([{ owner: user.id }, { "details.otherOwners": user.id }]).exec()).map(partialBotObject),
                title: user.username
            }) : res.render("message", {
                message: "Usuário não encontrado!"
            });
        });
    });
    return router;
};