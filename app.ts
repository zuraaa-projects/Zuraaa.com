import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import { join } from 'path'

import { server, api } from './config.json'
import ZuraaaApi from './modules/api'

import IndexRouter from './routes'
import BotsRouter from './routes/bots'
import { genAvatarUrl } from './utils/gen-avatar-url'

const app = express()

const root = process.cwd()

app.set('views', join(root, 'views'))
app.set('view engine', 'pug')

app.use(express.static(join(root, 'static')))
app.use(morgan('dev'))

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'child-src': ["'self'", 'https:'],
      'img-src': ["'self'", 'https:', 'data:']
    }
  },
  hsts: {
    maxAge: 15552000,
    includeSubDomains: true,
    preload: true
  }
}))
const modules = {
  api: new ZuraaaApi()
}

app.use((req, res, next) => {
  res.locals.apiBaseURL = api.outerBase
  res.locals.genAvatarUrl = genAvatarUrl
  next()
})

app.use('/', IndexRouter(modules))
app.use('/bots', BotsRouter(modules))

app.listen(server.port, () => {
  console.log('Online na porta', server.port)
})
