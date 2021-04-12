const express = require('express')

const router = express.Router()
const { partialBotObject } = require('../utils/bot')
const tags = require('../utils/tags')
const colors = require('../utils/colors')

const config = require('../config.json')
const { formatUrl } = require('../utils/avatar')

module.exports = (mongo, api) => {
  router.get('/', async (req, res) => {
    const filter = { approvedBy: { $ne: null } }
    res.render('index', {
      title: 'Início',
      bots: {
        top: (await mongo.Bots.find(filter).limit(6).sort({ 'votes.current': -1 })).map(partialBotObject),
        recent: (await mongo.Bots.find(filter).limit(6).sort({ 'dates.sent': -1 })).map(partialBotObject),
        random: (await mongo.Bots.aggregate([
          {
            $match: filter
          },
          {
            $sample: { size: 12 }
          }])).map(partialBotObject)
      },
      tags,
      colors
    })
  })

  router.get('/userdata', async (req, res) => {
    try {
      if (req.session.token) {
        const me = await api.getMe(req.session.token)
        return res.send({
          id: me._id,
          avatar: me.avatar,
          username: me.username,
          discriminator: me.discriminator,
          role: me.id === config.discord.ownerId ? 3 : me.details.role,
          buffer: formatUrl(me._id, me.avatar)
        })
      }
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        req.session.destroy()
      }
    }
    res.sendStatus(404)
  })

  router.post('/testwebhook', async (req, res) => {
    if (req.session.token) {
      const { type, url, authorization } = req.body
      const result = await api.testWebhook(req.session.token, {
        type,
        url,
        authorization
      })
      return res.sendStatus(result)
    }
    res.sendStatus(401)
  })
  return router
}
