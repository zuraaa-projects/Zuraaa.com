import { RouteFunction, colors } from '../types'
import { Router } from 'express'
import { BotsTags } from '../modules/api/types'
import { discord } from '../config.json'

const IndexRouter: RouteFunction = ({ api }) => {
  const router = Router()

  router.get('/', (req, res) => {
    (async () => {
      res.render('index', {
        tags: BotsTags,
        colors,
        bots: {
          top: await api.getBots({
            type: 'top',
            limit: '6'
          }),
          recent: await api.getBots({
            page: '1',
            limit: '6'
          }),
          random: await api.getBots({
            type: 'random',
            limit: '16'
          })
        }
      })
    })().catch(
      // todo
      console.error
    )
  })

  router.get('/discord', (req, res) => {
    res.redirect(discord.servers.support)
  })

  return router
}

export default IndexRouter
