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
  app.post('/shorten', (req, res, next) => {
    const user = req.user;
    var url = req.body.url;
    var private = req.body.private;
    console.log('private: ' + private);
    var key = req.body.key;
    if (key === '') {
      key = makeid();
    }

    // check if key is valid
    if (key.includes('/')) {
      req.flash('danger', 'Invalid key: key cannot contain "/"');
      res.redirect('/');
    } else {
      // create new mongodb document
      var newUrl = new Url({
        url: url,
        key: key
      });
      console.log('New url being created:\nurl:', newUrl.url + '\nkey:', newUrl.key + '\n ');


      // user is logged in *****************************************************************************
      // ***********************************************************************************************
      if (user) {
        if (!private) {
          // save to public urls if url is not private
          newUrl.save().then((savedUrl) => {
            console.log(savedUrl);
          });
        }

        // save to user's urls in users collection array if user is logged in
        console.log('updating current user: ', user.username);
        User.findOne({
          _id: user._id
        }).then((user) => {
          console.log('found user: ', user.username);
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
            var urlList = currentUser.urls;
            var shortedUrl = 'https://urll.herokuapp.com/' + key;

            res.render('index', {
              data: shortedUrl,
              originalUrl: url,
              user: user,
              urlList: urlList
            });
          });
        });
      }

      // else if user is not logged in ****************************************************
      // else save to urls collection *****************************************************
      else {
        newUrl.save().then((savedUrl) => {
          var shortedUrl = 'https://urll.herokuapp.com/' + savedUrl.key;
          var unshortedUrl = savedUrl.url;
          console.log('Url created: ' + shortedUrl);
          console.log(savedUrl);

          // redirect to homepage with shorted url
          res.render('index', {
            data: shortedUrl,
            originalUrl: unshortedUrl,
            user: null,
            urlList: null
          });
        });
      }
    }
  });


  // route for shorten using post method
  app.get('/shorten', (req, res) => {
    res.redirect('/');
  });


  // redirect to shorted url **************************************************************
  // **************************************************************************************
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