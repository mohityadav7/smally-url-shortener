const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const shortenController = require('./controllers/shortenController');
const authController = require('./controllers/authController');
const qrController = require('./controllers/qrController');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const User = require('./models/user-model');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// set up app
const app = express();

// https://docs.divio.com/en/latest/how-to/node-express-force-https/
app.enable('trust proxy');

app.use((request, response, next) => {
  if (process.env.NODE_ENV != 'development' && !request.secure) {
    return response.redirect('https://' + request.headers.host + request.url);
  }
  next();
});

// set up body parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// static files
app.use(express.static(__dirname + '/public'));

// set view engine
app.set('view engine', 'ejs');

// set cookie session
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_COOKIE_KEY],
  })
);

app.use(cookieParser('keyboard cat'));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'youaremortal',
    cookie: {
      maxAge: 60000,
    },
  })
);

app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to mLab database
mongoose.connect(process.env.MONGODB_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('Succssfully connected to MongoDB on mLab');
});

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  console.log(res.locals.messages);
  next();
});

// fire controllers
// fire qrController before shortenController
authController(app);
qrController(app);
shortenController(app);

app.get('/', (req, res) => {
  if (req.user) {
    User.findOne({
      _id: req.user._id,
    }).then((user) => {
      res.render('index', {
        data: '',
        user: req.user,
        urlList: user.urls,
        originalUrl: null,
      });
    });
  } else {
    console.log('User not logged in -> not showing url list. [index.js]');
    res.render('index', {
      data: '',
      user: null,
      urlList: null,
      originalUrl: null,
    });
  }
});

app.get('/*', (req, res) => {
  res.render('404');
});

// start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running...\nListening on port ${PORT}`);
});
