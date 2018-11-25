const mongoose = require('mongoose');

// UrlSchema
const UrlSchema = new mongoose.Schema({
  url: String,
  key: String
});

// create new Schema
const UserSchema = new mongoose.Schema({
  email: String,
  imageURL: String,
  googleID: String,
  username: String,
  urls: [UrlSchema]
});

// User model
const User = mongoose.model('user', UserSchema);

module.exports = User;