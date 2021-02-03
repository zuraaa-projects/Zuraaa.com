const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const Mongosession = require('connect-mongodb-session')(session);
const helmet = require('helmet');

const Mongo = require('./modules/mongo');
const indexRouter = require('./routes/index');
const botsRouter = require('./routes/bots');
const discordRouter = require('./routes/discord');
const oauth = require('./routes/oauth2');
const user = require('./routes/user');
const staff = require('./routes/staff');
const api = require('./routes/api');
const avatars = require('./routes/avatars');

const admvaga = require('./routes/vaga-adm');

const config = require('./config');

const storesession = new Mongosession({
  uri: config.database.mongo.url,
  collection: 'usersession',
});

const app = express();

const tag = require('./routes/tag');

const db = new Mongo(config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(helmet.hidePoweredBy());
app.use(helmet.expectCt());
app.use(helmet.referrerPolicy({
  policy: 'no-referrer',
}));
app.use(helmet.noSniff());
app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  }),
);
app.use(helmet.ieNoOpen());
app.use(
  helmet.frameguard({
    action: 'sameorigin',
  }),
);
app.use(
  helmet.permittedCrossDomainPolicies({
    permittedPolicies: 'none',
  }),
);
app.use(helmet.xssFilter());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

app.use(session({
  secret: config.server.session.secret,
  resave: true,
  saveUninitialized: false,
  store: storesession,
  cookie: {
    expires: 604800000,
  },
}));

/*

app.use(cookiesession({
  maxAge: 604800000,
  secret: config.server.session.secret,
  name: "session",
  secure: false
}));
*/

app.use('/', indexRouter(db));
app.use('/bots', botsRouter(config, db));
app.use('/discord', discordRouter(config));
app.use('/oauth2', oauth(config, db));
app.use('/user', user(db, config));
app.use('/tag', tag(db));
app.use('/staff', staff(config, db));
app.use('/api', api(db));
app.use('/avatars', avatars(db));
app.use('/', admvaga);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
  app,
  config,
};
