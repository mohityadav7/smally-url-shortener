const mongoose = require('mongoose');

var urls = [];

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Connect to mLab database
mongoose.connect('mongodb://a:a@ds263408.mlab.com:63408/codeshala');

// Database Setup
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  console.log("Connected To MongoLab Cloud Database :p");
});

// Schema Setup
var urlSchema = mongoose.Schema({
  url: String,
  key: String
});

// Model Setup
var Url = mongoose.model('Url', urlSchema);

module.exports = function shorten(app) {
  app.post('/shorten', function (req, res) {
    var url = req.body.url;
    var key = req.body.key;
    if(key === ''){
      key = makeid();
    }
    var newUrl = new Url({url: url, key: key});
    console.log(newUrl.url+'\n'+newUrl.key+'\n ');
    // urls.push({url: url, key: key});

    newUrl.save(function (err, e) {
      if(err) return console.error(err);
      console.log('Url created!');
    });
  });

  app.get('/:key', function (req, res) {
    Url.findOne({key: req.params.key}, function (err, url) {
      if(err){
        console.log('error: ' + err);
      }
      if(url !== null){
        console.log(url);
        res.redirect(url.url);
      }
    });
  });
};
