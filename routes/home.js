var express = require('express');
var router = express.Router();

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
    console.log(req.query);

    if (Object.keys(req.query).length !== 0) {
        console.log("Attempt to add new user");

        var user = new User (
            { name: req.query.name,
            email: req.query.email,
            role: "administrator",
            password: req.query.password
            }
        );

        console.log(user);
        
        // Check if user with same email already exists.
        console.log("check if user with same email already exists")
        User.findOne({ 'email': req.query.email })
            .exec( function(err, found_email) {
            if (err) { 
                console.log(err)
                res.redirect('/home/users/create');
                alert("unable to create new user. Please try again"); 
            }

            if (found_email) {
                console.log("email already exists");
                // Email already exists, redirect to login page.
                res.redirect('/home/users/signin');
            }
            else {
                console.log("save user");
                user.save(function (err) {
                    if (err) { 
                        console.log(err)
                        res.redirect('/home/users/create');
                        alert("unable to create new user. Please try again");
                    }
                    // User saved. Redirect to list of books that the user has access to via their institution page.
                    res.redirect('/home/books');
                });
            }
        });
    } else {
        res.render('create-user', { title: 'Create New User'});
    }
})

// post request to create a new user.
router.get('/users/create/', function(req, res) {
    
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