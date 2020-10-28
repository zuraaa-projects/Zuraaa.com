const express = require('express');
const router = express.Router();
const Mongo = require('../modules/mongo');
const {partialBotObject} = require("../utils/bot");
const cache = require("../utils/imageCache");

/**
 * 
 * @param {Mongo} mongo 
 */
module.exports = (mongo, config) => {
    router.get('/:userId', (req, res) => {
        mongo.Users.findById(req.params.userId).exec().then((user) => {
            if (!user)
                res.sendStatus(404);
            cache(config).saveCached(user).then(async element => {
                element.save();
                
                const avatarUrl = (Buffer.isBuffer(element.avatarBuffer.contentType)) ? Buffer.from(element.avatarBuffer.contentType).toString('base64') : element.avatarBuffer.contentType
                
                console.table({ buffer: Buffer.isBuffer(element.avatarBuffer.contentType), result: avatarUrl})
                
                user ? res.render("user", {
                    user: {
                        avatar: `data:${avatarUrl};base64, ${element.avatarBuffer.data}`,
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
    });
    return router;
};