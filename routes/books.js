var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Institution = require('../models/institution');

// root route.
router.get('/', function (req, res) {
    //Once authenticated, responds with a JSON object containing a list of Books that the user has access to via their Institution.
    res.send('Get all books that this user has access to via their institution');
})

module.exports = router;