const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const shortenController = require('./controllers/shortenController');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const User = require('./models/user-model');

// set up app
const app = express();

// set up body parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// static files
app.use(express.static(__dirname + '/public'));

// set view engine
app.set('view engine', 'ejs');

// set cookie session
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));


// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Connect to mLab database
mongoose.connect(keys.mongodb.dbURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log("Succssfully connected to MongoDB on mLab");
});


// fire controllers
authController(app);
shortenController(app);
// userController(app);


// routes
// app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  console.log(req.user);
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
    console.log('User not logged in -> not showing url list. [index.js]');
    res.render('index', {
      data: '',
      user: null,
      urlList: null
    });
  }
});

app.get('/*', (req, res) => {
  res.send('404 | Page not found!');
});

// listen to port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...\nListening on port 3000");
});