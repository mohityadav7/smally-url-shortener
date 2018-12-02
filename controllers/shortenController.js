const mongoose = require('mongoose');
const Url = require('../models/url-model');
const User = require('../models/user-model');
const qr = require('qr-image');
const fs = require('fs');

// function to generate random 5 digit id for urls
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = (app) => {
  // route for shorten using post method
  app.post('/shorten', (req, res) => {
    const user = req.user;
    var url = req.body.url;
    var key = req.body.key;
    if (key === '') {
      key = makeid();
    }

    // create new mongodb document
    var newUrl = new Url({
      url: url,
      key: key
    });
    console.log('New url being created:\nurl:', newUrl.url + '\nkey:', newUrl.key + '\n ');

    // save to user's url in users collection array if user is logged in
    if (user) {
      console.log('updating current user', user);
      User.findOne({
        _id: user._id
      }).then((user) => {
        console.log('found user ', user);
      });

      User.updateOne({
        _id: user._id
      }, {
        $push: {
          urls: newUrl
        }
      }).then((updatedDetails) => {
        // redirect to homepage with shorted url
        console.log('Updated details: ' + updatedDetails);
        // find user to get url list
        User.findOne({
          _id: user._id
        }).then((currentUser) => {
          var shortedUrl = 'https://urll.herokuapp.com/' + key;

          // generate qr codes of original link and shorted link
          qr.image(url, {
            type: 'svg'
          }).pipe(fs.createWriteStream('./public/qr-unshorted.svg'));

          qr.image(shortedUrl, {
            type: 'svg'
          }).pipe(fs.createWriteStream('./public/qr-shorted.svg'));

          res.render('index', {
            data: shortedUrl,
            user: user,
            urlList: currentUser.urls,
            svg: true
          });
        });
      });
    }
    // else save to urls collection
    else {
      newUrl.save().then((savedUrl) => {
        var shortedUrl = 'https://urll.herokuapp.com/' + savedUrl.key;
        console.log('Url created: ' + shortedUrl);
        console.log(savedUrl);

        // generate qr codes of original link and shorted link
        qr.image(savedUrl.url, {
          type: 'svg'
        }).pipe(fs.createWriteStream('./public/qr-unshorted.svg'));

        qr.image(shortedUrl, {
          type: 'svg'
        }).pipe(fs.createWriteStream('./public/qr-shorted.svg'));

        // redirect to homepage with shorted url
        res.render('index', {
          data: shortedUrl,
          user: null,
          urlList: null,
          svg: true
        });
      });
    }
  });


  // route for shorten using post method
  app.get('/shorten', (req, res) => {
    res.redirect('/');
  });


  // redirect to shorted url
  app.get('/:key', (req, res) => {
    const user = req.user;
    const key = req.params.key;

    if (key != 'favicon.ico' && key != 'robots.txt') {
      // if user is logged in, search in current user's urls
      if (user) {
        console.log('User exist: ' + user);
        // search user by id
        User.findOne({
          _id: user._id
        }).select({
          urls: {
            $elemMatch: {
              key: req.params.key
            }
          }
        }).then((currentUser) => {
          console.log('currentUser:', currentUser);
          if (currentUser) {
            console.log('Found in users collection:', currentUser);
            if (currentUser.urls.length > 0) {
              res.redirect(currentUser.urls[0].url);
            } else {
              req.flash('danger', 'URL not found with key ' + req.params.key);
              res.redirect('/');
            }
          } else {
            console.log('url not found! Searching outside users collection.');
            Url.findOne({
              key: req.params.key
            }, (err, url) => {
              if (err) {
                console.log('error: ' + err);
              }
              if (url !== null) {
                console.log(url);
                res.redirect(url.url);
              } else {
                res.send('not found!');
              }
            });
          }
        });
      }
      // then search for other urls
      else {
        console.log('User not found.');
        Url.findOne({
          key: req.params.key
        }, (err, url) => {
          if (err) {
            console.log('error: ' + err);
          }
          if (url !== null) {
            console.log(url);
            res.redirect(url.url);
          } else {
            res.send('not found!');
          }
        });
      }
    }
  });
};