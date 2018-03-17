var urls = [];

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = function shorten(app) {
  app.post('/shorten', function (req, res) {
    var url = req.body.url;
    var key = req.body.key;
    if(key === ''){
      key = makeid();
    }
    urls.push({url: url, key: key});

    for (var i = 0; i < urls.length; i++) {
      console.log(urls[i]);
    }
  });

  app.get('/:key', function (req, res) {
    var found = false;
    for (var i = 0; i < urls.length; i++) {
      if (urls[i].key === req.params.key){
        res.redirect(urls[i].url);
        found = true;
      }
    }
    if(!found){
      res.send('Not found!');
    }
  });
};
