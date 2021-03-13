import Api from '../modules/api'

import { Router } from 'express'

const router = Router()

export default (api: Api): Router => {
  router.get('/:id', (req, res) => {
    api.getAvatar(req.params.id).then(avatar => {
      res.writeHead(200, {
        'Content-Type': avatar.type,
        'Content-Length': avatar.length
      })
      res.end(avatar.data)
    }).catch(() => {
      res.redirect('https://cdn.discordapp.com/embed/avatars/4.png')
    })
  })
  return router
}
