var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var User = require('../models/user');
var Institution = require('../models/institution');

var async = require('async');

// GET request for list of all users.
router.get('/user-list', function(req, res) {
  res.send('NOT IMPLEMENTED: user list');
});

// GET request for one user.
router.get('/user/:id', function(req, res) {
    res.send('NOT IMPLEMENTED: single user');
  });

// GET request for list of all institutions.
router.get('/institution-list', function(req, res) {
  res.send('NOT IMPLEMENTED: institution list');
});

// GET request for list of all books.
router.get('/book-list', function(req, res) {
  Book.find({}, 'title author institutions')
    .populate('institutions')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });
});

// GET request to create a new user.
router.get('/user/create', function(req, res) {
  res.send('NOT IMPLEMENTED: single user');
});

router.get('/', function(req, res) {
  async.parallel({
    book_count: function(callback) {
        Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
    },
    user_count: function(callback) {
        User.countDocuments({}, callback);
    },
    user_student_count: function(callback) {
        User.countDocuments({role:'student'}, callback);
    },
    institution_count: function(callback) {
        Institution.countDocuments({}, callback);
    },
  }, function(err, results) {
      res.render('index', { title: 'BibliU Coding Challenge', error: err, data: results });
  });
})

module.exports = router;