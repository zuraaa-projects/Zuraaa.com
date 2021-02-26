const express = require('express');

const router = express.Router();
const { captchaIsValid } = require('../utils/captcha');

/**
 *
 * @param {*} config
 * @param {*} api
 */
module.exports = (config, api) => {
  function generateUrl() {
    const params = new URLSearchParams({
      client_id: config.oauth.client.id,
      redirect_uri: config.oauth.urls.redirect,
      response_type: 'code',
      scope: 'identify',
    });
    return `${config.oauth.urls.authorization}?${params}`;
  }

  router.get('/login', (req, res) => {
    res.redirect(generateUrl(config));
  });

  router.get('/callback', (req, res) => {
    const { code } = req.query;
    if (code) {
      res.render('login', {
        captcha: config.recaptcha.public,
        code,
      });
    } else {
      res.redirect('/oauth2/login');
    }
  });

  router.post('/callback', (req, res) => {
    const { code, ...captcha } = req.body;
    if (code && captchaIsValid(config.recaptcha, captcha)) {
      api.login(code)
        .then((discordToken) => {
          if (discordToken) {
            req.session.token = discordToken.access_token;
            req.session.save(() => {
              res.redirect(req.session.path || '/');
            });
          } else {
            res.redirect('/oauth2/login');
          }
        });
    } else {
      res.redirect('/oauth2/login');
    }
  });

  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  return router;
};
