const mongoose = require('mongoose');

// Schema Setup
var urlSchema = mongoose.Schema({
  url: String,
  key: String,
});

// Model Setup
var Url = mongoose.model('Url', urlSchema);

module.exports = Url;
