const express = require('express')

const router = express.Router()
const { partialBotObject } = require('../utils/bot')
const cache = require('../utils/imageCache')

/**
 *
 * @param {Mongo} mongo
 */
module.exports = (mongo, config, api) => {
  router.get('/:userId', (req, res) => {
    mongo.Users.findById(req.params.userId).exec().then((user) => {
      cache(config).saveCached(user).then(async (element) => {
        element.save()
        if (user) {
          res.render('user', {
            logged: req.session.user,
            user: {
              banned: user.banned,
              id: user.id,
              avatar: `data:${element.avatarBuffer.contentType};base64, ${element.avatarBuffer.data}`,
              name: user.username,
              tag: user.discriminator,
              url: `/user/${user.details.customURL || user.id}/`,
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

  router.get('/:id/:action', (req, res) => {
    if (!req.session.user) {
      req.session.path = req.originalUrl
      res.redirect('/oauth2/login')
      return
    }

    const { user } = req.session
    const { id, action } = req.params

    if (action === 'ban' || action === 'unban') {
      if (user.role > 2) {
        mongo.Users.findById(id).exec().then((userb) => {
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
        res.render('message', {
          title: 'Não Implementado',
          message: 'Este recurso ainda não foi implementado'
        })
      } else {
        res.render('message', {
          title: 'Acesso negado',
          message: 'Você não tem permissão de acessar este endpoint'
        })
      }
    }
  })

  router.post('/:id/:action', (req, res) => {
    try {
      if (!req.session.user) {
        req.session.path = req.originalUrl
        res.redirect('/oauth2/login')
        return
      }

      const { user, token } = req.session
      let { reason } = req.body
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
          res.render('message', {
            title: 'Não Implementado',
            message: 'Este recurso ainda não foi implementado'
          })
        } else {
          res.render('message', {
            title: 'Acesso negado',
            message: 'Você não tem permissão de acessar este endpoint'
          })
        }
      }
    } catch (error) {
      console.error(error)
      res.render('message', {
        title: 'Erro interno',
        message: 'Ocorreu um erro interno enquanto processávamos sua solicitação, pedimos desculpas pela incoveniência.'
      })
    }
  })

  return router
}
