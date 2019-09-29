const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://serenelc:EMfaf14307@testcluster-brf3n.mongodb.net/bibliu?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const index = require('./routes/index.js');
var home = require('./routes/home.js');
var testRouter = require('./tests/test');

app.get('/', index);

// app.get('/', function (req, res) {
//     res.render('index', { title: 'Hey', message: 'Hello there!' })
// })

// app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/books' }));

app.listen(3000, () => console.log(`Open http://localhost:3000 to see a response.`));

app.use('/home', home);
app.use('/test', testRouter);
app.use(express.static('public'))