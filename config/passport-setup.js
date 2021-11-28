const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strat
      callbackURL: '/auth/google/redirect',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      console.log('passport cb function fired.');
      console.log(profile);

      User.findOne({
        googleID: profile.id,
      }).then((currentUser) => {
        console.log(currentUser);
        if (currentUser) {
          console.log('found user: ', currentUser);
          done(null, currentUser);
        } else {
          console.log('user not found!');
          new User({
            username: profile.displayName,
            googleID: profile.id,
          })
            .save()
            .then((newUser) => {
              console.log('new user created', newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
