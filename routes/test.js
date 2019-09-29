var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var User = require('../models/user');
var Institution = require('../models/institution');

var async = require('async');

// GET request for list of all users.
router.get('/user-list', function(req, res) {
  User.find({}, 'name email role')
  .exec(function (err, list_users) {
    if (err) { return next(err); }
    res.render('user_list', { title: 'User List', user_list: list_users });
  });
});

// GET request for list of books authorised to a specific institution
router.get('/institution/:id', function(req, res) {
  async.parallel({
    institution: function(callback) {
        Institution.findById(req.params.id)
          .exec(callback);
    },

    institution_books: function(callback) {
        Book.find({ 'institutions': req.params.id })
          .exec(callback);
    },

}, function(err, results) {
    if (err) { return next(err); }
    if (results.institution == null) {
        var err = new Error('Institution not found');
        err.status = 404;
        return next(err);
    }
    res.render('books_by_institution', { title: 'Institution Detail', institution: results.institution, institution_books: results.institution_books } );
});
});

// GET request for list of all institutions.
router.get('/institution-list', function(req, res) {
  Institution.find({}, 'name url')
  .exec(function (err, list_institutions) {
    if (err) { return next(err); }
    res.render('institution_list', { title: 'Institution List', institution_list: list_institutions });
  });
});

// GET request for list of all books.
router.get('/book-list', function(req, res) {
  Book.find({}, 'title author institutions')
    .populate('institutions')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
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