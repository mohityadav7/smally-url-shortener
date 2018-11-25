const passport = require('passport');
const User = require('../models/user-model');

module.exports = (app) => {
  // auth Login
  app.get('/auth/login', (req, res) => {
    res.render('login', {
      user: req.user
    });
  });

  // auth logout
  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.render('index', {
      data: '',
      user: req.user,
      urlList: null
    });
  });

  // auth with google
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }), (req, res) => {
    // handle with passport
    res.send('logging in with google');
  });

  app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('user:', req.user);
    if (req.user) {
      User.findOne({
        _id: req.user._id
      }).then((user) => {
        res.render('index', {
          data: '',
          user: req.user,
          urlList: user.urls
        });
      });
    } else {
      console.log('User not logged in -> not showing url list. [authController.js]');
      res.render('index', {
        data: '',
        user: req.user,
        urlList: null
      });
    }
  });
}