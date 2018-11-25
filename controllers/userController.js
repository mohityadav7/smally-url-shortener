const mongoose = require('mongoose');
const keys = require('../config/keys.js');
const User = require('../models/user-model');

module.exports = (app) => {
  // login
  app.get('/login', (req, res) => {
    console.log('rendering login page.');
    res.render('login');
  });
}