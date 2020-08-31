const { urlencoded } = require("express");
const express = require("express");
const Mongo = require("../modules/mongo");
const user = require("../utils/user");
const md = require("markdown-it")();

const Router = express.Router();

/**
 * 
 * @param {Mongo} db 
 */
module.exports = (db) => {
    Router.get("/:id", (req, res) => {
        db.Bots.findById(req.params.id).exec().then(bot => {
            if(!bot)
                return res.sendStatus(404);
            
            if(!bot.details.htmlDescription){
                bot.details.htmlDescription = md.render(bot.details.longDescription);
                bot.save();
            }

        
            res.render("bot", {
                bot: {
                    avatar: user.avatarFormat(bot),
                    name: bot.username,
                    tag: bot.discriminator,
                    bio: bot.details.shortDescription,
                    content:  "data:text/html;charset=utf-8," + encodeURIComponent(bot.details.htmlDescription)
                },
                title: bot.username
            });
    
        })
      });
    

    return Router;
}