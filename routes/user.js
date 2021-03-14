const express = require('express')

const router = express.Router()
const { partialBotObject } = require('../utils/bot')
const ImageCache = require('../utils/ImageCache').default
const { formatUrl } = require('../utils/avatar')

/**
 *
 * @param {Mongo} mongo
 */
module.exports = (mongo, api) => {
  const cache = new ImageCache(api)
  
  router.use((req, res, next) => {
    api.getMe(req.session.token).then((session) => {
      if(session !== undefined) {
        if (session.banned) {
          req.session.destroy(() => {
            next()
          })
        }
      }
    })
    next()
  })

  router.get('/:userId', async (req, res) => {
    const session = await api.getMe(req.session.token)
    api.getUser(req.params.userId).then((user) => {
      cache.saveCached(user, false).then(async () => {
        if (user) {
          res.render('users/user', {
            session,
            user: {
              avatar: formatUrl(user._id),
              id: user._id,
              name: user.username,
              tag: user.discriminator,
              url: `/user/${user.details.customURL || user._id}/`,
              bio: user.details.description || 'Esse usuário ainda não definiu uma biografia.'
            },
            bots: (await api.getUserBots(user._id))
              .filter(bot => bot.approvedBy || (session && (session._id === bot.owner || session.details.role < 1)))
              .map(partialBotObject),
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

  router.get('/:id/:action', async (req, res) => {
    if (!req.session.user) {
      req.session.path = req.originalUrl
      res.redirect('/oauth2/login')
      return
    }
    const { id, action } = req.params
    const session = await api.getMe(req.session.token)

     api.getUser(req.params.userId).then((user) => {
      if (user) {
        if (action === 'action') {
          if (session.details.role > 2) {
            res.render('staff/action', {
              session,
              user
            })
          } else {
            res.render('message', {
              title: 'Acesso negado',
              message: 'Você não tem permissão de acessar este endpoint'
            })
          }
        } else if (action === 'edit') {
          if (id === session.id) {
            res.render('users/edit', {
              user: {
                id: user._id,
                name: user.username,
                tag: user.discriminator
              },
              title: `Editar ${user.username}`,
            })
          } else {
            res.render('message', {
              title: 'Acesso negado',
              message: 'Você não tem permissão de acessar este endpoint'
            })
          }
        }
      } else {
        res.render('message', {
          message: 'Usuário não encontrado!'
        })
      }
    })
  })

  router.post('/:id/:action', async (req, res) => {
    try {
      if (!req.session.user) {
        req.session.path = req.originalUrl
        res.redirect('/oauth2/login')
        return
      }

      const { user, token } = req.session
      let { reason, bio } = req.body
      const { id, action } = req.params
      if (action === 'ban' || action === 'unban') {
        if (user.role > 2) {
          mongo.Users.findById(id).exec().then(async (userb) => {
            if (id === user.id) {
              res.render('message', {
                message: 'Você não pode banir ou desbanir à si mesmo.'
              })
            }
            if (userb) {
              if (action === 'ban') {
                if (userb.banned) {
                  return res.render('message', {
                    message: 'O usuário ja se encontra banido!'
                  })
                }

                if (reason === undefined) {
                  reason = 'Sem motivo informado.'
                }

                await api.ban(token, id, reason)
                res.render('message', {
                  title: 'Sucesso!',
                  message: 'Você baniu o usuário com sucesso!'
                })
              } else {
                if (!userb.banned) {
                  return res.render('message', {
                    message: 'O usuário não se encontra banido!'
                  })
                }
                await api.unban(token, id)
                res.render('message', {
                  title: 'Sucesso!',
                  message: 'Você desbaniu o usuário com sucesso!'
                })
              }
            } else {
              res.render('message', {
                message: 'Usuário não encontrado!'
              })
            }
          })
        } else {
          res.render('message', {
            title: 'Acesso negado',
            message: 'Você não tem permissão de acessar este endpoint'
          })
        }
      } else if (action === 'edit') {
        if (id === user.id) {
          if (bio === undefined) {
            bio = null
          }
          await api.updateMe(token, bio)
          res.render('message', {
            title: 'Sucesso!',
            message: 'Você editou sua biografia com sucesso!'
          })
        } else {
          res.render('message', {
            title: 'Acesso negado',
            message: 'Você não tem permissão de acessar este endpoint'
          })
        }
      }
    } catch (error) {
      const { data } = error.response
      if (data.statusCode === 403) {
        return res.render('message', {
          title: data.statusCode,
          message: data.message
        })
      }
      console.error(error)
      res.render('message', {
        title: 'Erro interno',
        message: 'Ocorreu um erro interno enquanto processávamos sua solicitação, pedimos desculpas pela incoveniência.'
      })
    }
  })

  return router
}
