const express = require('express')

const router = express.Router()
const cache = require('../utils/imageCache')
const { captchaIsValid } = require('../utils/captcha')

/**
 *
 * @param {*} config
 * @param {Mongo} mongo
 */
module.exports = (config, mongo, api) => {
  function generateUrl () {
    return `${config.oauth.urls.authorization}?client_id=${config.oauth.client.id}` +
        `&redirect_uri=${encodeURIComponent(config.oauth.urls.redirect)}&response_type=code&scope=identify`
  }

  async function saveData (user) {
    const userFind = await mongo.Users.findById(user._id).exec()
    return await (await cache(config).saveCached(userFind)).save()
  }

  router.get('/login', (req, res) => {
    res.redirect(generateUrl(config))
  })

  router.get('/callback', (req, res) => {
    const { code } = req.query
    if (code) {
      res.render('login', {
        captcha: config.recaptcha.public,
        code
      })
    } else {
      res.redirect('/oauth2/login')
    }
  })

  router.post('/callback', (req, res) => {
    const { code, ...captcha } = req.body
    if (code && captchaIsValid(config.recaptcha, captcha)) {
      try {
        api.login(code).then(({ access_token: token }) => {
          api.getMe(token).then(async user => {
            req.session.token = token
            req.session.user = {
              id: user._id,
              username: user.username,
              discriminator: user.discriminator,
              avatar: user.avatar
            }
            const x = await saveData(user)
            req.session.user.role = x.id === config.discord.ownerId ? 3 : x.details.role
            req.session.user.buffer = (x.avatarBuffer && x.avatarBuffer.contentType) &&
                        `data:${x.avatarBuffer.contentType};base64, ${x.avatarBuffer.data}`
            req.session.save(() => res.redirect(req.session.path || '/'))
          })
        })
          .catch((error) => {
            const { data } = error.response
            if (data.statusCode === 403) {
              return res.render('message', {
                title: data.statusCode,
                message: data.message
              })
            }
          })
      } catch (error) {
        const { data } = error.response
        if (data.statusCode === 403) {
          return res.render('message', {
            title: data.statusCode,
            message: data.message
          })
        }
        res.redirect('/oauth2/login')
      }
    } else {
      res.redirect('/oauth2/login')
    }
  })

  router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
  })

  return router
}
