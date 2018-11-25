const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const shortenController = require('./controllers/shortenController');
// const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const User = require('./models/user-model');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

app.use(cookieParser('keyboard cat'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'youaremortal',
  cookie: {
    maxAge: 60000
  }
}));

app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Connect to mLab database
mongoose.connect(keys.mongodb.dbURI, {
  useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log("Succssfully connected to MongoDB on mLab");
});

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  console.log(res.locals.messages);
  next();
});

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

// fire controllers
authController(app);
shortenController(app);

app.get('/*', (req, res) => {
  res.send('404 | Page not found!');
});

// listen to port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...\nListening on port 3000");
});