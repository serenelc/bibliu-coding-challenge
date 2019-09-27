var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var User = require('../models/user');
var Institution = require('../models/institution');

// GET request for list of all users.
router.get('/user-list', function(req, res) {
  res.send('NOT IMPLEMENTED: user list');
});

// GET request for one user.
router.get('/user/:id', function(req, res) {
    res.send('NOT IMPLEMENTED: single user');
  });

router.get('/', function(req, res) {
    res.render('index', { title: 'TEST', message: 'TESTING TESTING' })
})

module.exports = router;