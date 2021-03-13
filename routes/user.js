const express = require('express')

const router = express.Router()
const { partialBotObject } = require('../utils/bot')
const ImageCache = require('../utils/ImageCache').default

/**
 *
 * @param {Mongo} mongo
 */
module.exports = (mongo, config, api) => {
  const cache = new ImageCache(api)
  router.get('/:userId', (req, res) => {
    mongo.Users.findById(req.params.userId).exec().then((user) => {
      if (!user) { res.sendStatus(404) }
      cache.saveCached(user, false).then(async () => {
        if (user) {
          res.render('user', {
            user: {
              avatar: `/avatars/${user.id}`,
              name: user.username,
              tag: user.discriminator,
              bio: user.details.description || 'Esse usuário ainda não definiu uma biografia.'
            },
            bots: (await mongo.Bots.find().or([{ owner: user.id }, { 'details.otherOwners': user.id }]).exec()).map(partialBotObject),
            title: user.username
          })
        } else {
          res.render('message', {
            message: 'Usuário não encontrado!'
          })
        }
      })
    })
  })
  return router
}
