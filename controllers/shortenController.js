const mongoose = require('mongoose');
const Url = require('../models/url-model');
const User = require('../models/user-model');

// var urls = [];

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
        console.log(updatedDetails);
        // find user to get url list
        User.findOne({
          _id: user._id
        }).then((currentUser) => {
          res.render('index', {
            data: 'https://urll.herokuapp.com/' + key,
            user: user,
            urlList: currentUser.urls
          });
        });
      });
    }
    // else save to urls collection
    else {
      newUrl.save().then((url) => {
        console.log('Url created: ' + url);

        // redirect to homepage with shorted url
        res.render('index', {
          data: 'https://urll.herokuapp.com/' + key,
          user: null,
          urlList: null
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
    // if user is logged in, search in current user's urls
    // if (req.params.key != '') {
    if (user) {
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
            req.flash('danger', 'URL not found');
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
    // }
  });
};