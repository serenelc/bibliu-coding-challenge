var express = require('express');
var router = express.Router();
const validator = require('express-validator');

var Book = require('../models/book');
var User = require('../models/user');
var Institution = require('../models/institution');

var async = require('async');

// get request to display signin form
router.get('/users/signin', function(req, res) {
    res.send("TODO sign in user")
})

// get request to display list of books that the user has access to
router.get('/books', function(req, res) {
    res.send("TODO list of books for that user")
})

// get request to display create form
router.get('/users/create', function(req, res) {
    res.render('create-user', { title: 'Create New User'});
})

// post request to create a new user.
router.post('/users/create', function(req, res) {
    console.log("made request");

    // Validate that the email field is not empty.
    validator.body('email', 'Email required').isLength({min: 1}).trim(),
    // Sanitize (escape)
    validator.sanitizeBody('email').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        console.log("validated and sanitized")

        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a user object with escaped and trimmed data.
        var user = new User(
            { name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('create-user', { title: 'Create New User', user: user, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if user with same email already exists.
            console.log("check if user with same email already exists")
            User.findOne({ 'email': req.body.email })
                .exec( function(err, found_email) {
                if (err) { return next(err); }

                if (found_email) {
                    console.log("email already exists");
                    // Email already exists, redirect to login page.
                    res.redirect('/home/users/signin');
                }
                else {
                    console.log("save user");
                    user.save(function (err) {
                        if (err) { return next(err); }
                        // User saved. Redirect to list of books that the user has access to via their institution page.
                        res.redirect('/home/books');
                    });

                }

                });
        }
    }
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