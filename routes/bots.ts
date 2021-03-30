import { Router } from 'express'
import { RouteFunction } from '../types'

const BotsRouter: RouteFunction = ({ api }) => {
  const router = Router()

  router.get('/', (req, res) => {
    const queryOrUndefined = (param: any): string | undefined => {
      if (param !== '') {
        return param
      }
    }
    const page = queryOrUndefined(req.query.page) ?? '1'
    const search = queryOrUndefined(req.query.search)
    api.getBots({
      page: page,
      search: search,
      limit: '18'
    }).then((bots) => {
      res.render('bots/bots', {
        bots,
        page: parseInt(page) ?? 1,
        search
      })
    }).catch(console.error
      // todo
    )
  })

  router.get('/:id', (req, res) => {
    res.render('bots/botpage')
  })

  return router
}

export default BotsRouter
