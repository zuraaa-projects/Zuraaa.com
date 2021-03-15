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
  router.get('/:userId', (req, res) => {
    mongo.Users.findById(req.params.userId).exec().then((user) => {
      if (!user) { res.sendStatus(404) }
      cache.saveCached(user, false).then(async () => {
        if (user) {
          res.render('user', {
            logged: req.session.user,
            user: {
              avatar: formatUrl(user.id),
              banned: user.banned,
              id: user.id,
              name: user.username,
              tag: user.discriminator,
              url: `/user/${user.details.customURL || user.id}/`,
              bio: user.details.description || 'Esse usuário ainda não definiu uma biografia.'
            },
            bots: (await mongo.Bots
              .find()
              .or([{ owner: user.id }, { 'details.otherOwners': user.id }])
              .exec())
              .filter(bot => bot.approvedBy || (req.session.user && (req.session.user.id === bot.owner || req.session.user.role < 1)))
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

  router.get('/:id/:action', (req, res) => {
    if (!req.session.user) {
      req.session.path = req.originalUrl
      res.redirect('/oauth2/login')
      return
    }

    const { user } = req.session
    const { id, action } = req.params

    mongo.Users.findById(id).exec().then((userb) => {
      if (userb) {
        if (action === 'ban' || action === 'unban') {
          if (user.role > 2) {
            if (id === user.id) {
              res.render('message', {
                message: 'Você não pode banir ou desbanir à si mesmo.'
              })
            }
            if (action === 'ban') {
              if (userb.banned) {
                return res.render('message', {
                  message: 'O usuário ja se encontra banido!'
                })
              }
              res.render('action', {
                user: {
                  id: userb.id,
                  name: userb.username,
                  tag: userb.discriminator
                },
                title: `Banir ${userb.username}`,
                type: 'Banir',
                action
              })
            } else {
              if (!userb.banned) {
                return res.render('message', {
                  message: 'O usuário não se encontra banido!'
                })
              }
              res.render('action', {
                user: {
                  id: userb.id,
                  name: userb.username,
                  tag: userb.discriminator
                },
                title: `Desbanir ${userb.username}`,
                type: 'Desbanir',
                action
              })
            }
          } else {
            res.render('message', {
              title: 'Acesso negado',
              message: 'Você não tem permissão de acessar este endpoint'
            })
          }
        } else if (action === 'edit') {
          if (id === user.id) {
            res.render('action', {
              user: {
                id: userb.id,
                name: userb.username,
                tag: userb.discriminator
              },
              title: `Editar ${userb.username}`,
              type: 'Editar',
              action
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
          await api.updateMe(token, bio || null)
          res.redirect('/user/' + user.id)
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
        req.session.destroy(() => {
          return res.render('message', {
            title: 'BANIDO',
            message: 'Você está banido! 🙂'
          })
        })
        return
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
