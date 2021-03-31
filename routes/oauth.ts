import { RouteFunction } from '../types'
import { Router } from 'express'
import { oauth, api as server } from '../config.json'

const OAuthRouter: RouteFunction = ({ api }) => {
  const router = Router()

  router.get('/login', (req, res) => {
    res.redirect(oauth.urls.authorization)
  })

  router.get('/callback', (req, res) => {
    res.render('login', {
      secret: server.secret
    })
  })

  return router
}

export default OAuthRouter
