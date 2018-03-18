const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortenController = require('./controllers/shortenController');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// static files
app.use(express.static(__dirname + '/public'));

// fire controllers
shortenController(app);

// routes
app.get('/', function (req, res) {
  res.sendFile('./views/index.html', {root: __dirname});
});

app.get('/*', function (req, res) {
  res.send('404 | Page not found!');
});

// listen to port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running...\nListening on port 3000");
});
