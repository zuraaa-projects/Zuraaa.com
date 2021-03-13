import createError from 'http-errors'
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session'
import MongoDBSession from 'connect-mongodb-session'
import helmet from 'helmet'
import fileUpload from 'express-fileupload'

import Mongo from './modules/mongo'
import indexRouter from './routes/index'
import botsRouter from './routes/bots'
import discordRouter from './routes/discord'
import oauth from './routes/oauth2'
import user from './routes/user'
import staff from './routes/staff'
import avatars from './routes/avatars'

import config from './config.json'

import tag from './routes/tag'
import Api from './modules/api'

const MongoSession = MongoDBSession(session)

const storesession = new MongoSession({
  uri: config.database.mongo.url,
  collection: 'usersession'
})

const app = express()

const db = new Mongo(config)

const base = process.cwd()

// view engine setup
app.set('views', path.join(base, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))

app.use(helmet.hidePoweredBy())
app.use(helmet.expectCt())
app.use(helmet.referrerPolicy({
  policy: 'no-referrer'
}))
app.use(helmet.noSniff())
app.use(
  helmet.dnsPrefetchControl({
    allow: false
  })
)
app.use(helmet.ieNoOpen())
app.use(
  helmet.frameguard({
    action: 'sameorigin'
  })
)
app.use(
  helmet.permittedCrossDomainPolicies({
    permittedPolicies: 'none'
  })
)
app.use(helmet.xssFilter())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(base, 'static')))

app.use(session({
  secret: config.server.session.secret,
  resave: true,
  saveUninitialized: false,
  store: storesession,
  cookie: {
    maxAge: 604800000
  }
}))

app.use(fileUpload())

/*

app.use(cookiesession({
  maxAge: 604800000,
  secret: config.server.session.secret,
  name: "session",
  secure: false
}));
*/

const api = new Api()

app.use('/', indexRouter(db))
app.use('/bots', botsRouter(config, db, api))
app.use('/discord', discordRouter(config))
app.use('/oauth2', oauth(config, db, api))
app.use('/user', user(db, config, api))
app.use('/tag', tag(db))
app.use('/staff', staff(config, db))
app.use('/avatars', avatars(api))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status ?? 500)
  res.render('error')
})

export default {
  app,
  config
}
