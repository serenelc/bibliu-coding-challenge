const express = require('express');
const app = express();

require('dotenv').config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

app.set('view engine', 'pug')

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://'+ username + ':' + password + '@testcluster-brf3n.mongodb.net/bibliu?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const index = require('./routes/index.js');
var home = require('./routes/home.js');
var testRouter = require('./tests/test');

app.get('/', index);

app.listen(3000, () => console.log(`Open http://localhost:3000 to see a response.`));

app.use('/home', home);
app.use('/test', testRouter);
app.use(express.static('public'))