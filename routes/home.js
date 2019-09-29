var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var User = require('../models/user');
var Institution = require('../models/institution');

var async = require('async');

// get request to display signin form
router.get('/users/signin', function(req, res) {
    console.log(req.query);

    if (Object.keys(req.query).length !== 0) {       
        //try to login existing user
        User.findOne({ 'email': req.query.email }, 'password')
            .exec( function(err, password) {
                console.log(password)
                if (err) { 
                    console.log(err)
                    res.redirect('/home/users/signin');
                    alert("unable to login. Please try again"); 
                }

                if (!password) {
                    console.log("email doesn't exist");
                    // Email doesn't exist. Redirect to create user page.
                    res.redirect('/home/users/create');
                }
                
                if (password === req.query.password) {
                    res.redirect('/home/books?user=' + req.query.email);
                } else {
                    console.log(err)
                    res.redirect('/home/users/signin');
                    alert("incorrect password. Please try again"); 
                }
        });
    } else {
        res.render('signin-user', { title: 'Sign In As An Existing User'});
    }
})

// get request to display list of books that the user has access to
router.get('/books', function(req, res) {
    const email = req.query.user;
    const domainStartIndex = email.indexOf("@") + 1;
    const institution = email.substring(domainStartIndex, email.length);

    console.log(institution);

    async.parallel({
        institution: function(callback) {
            Institution.find({ name: institution})
              .exec(callback);
        },
    
        institution_books: function(callback) {
            Book.find({institutions: "5d9087dc1c9d4400005d3897"})
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { 
            return next(err);
        }

        if (results.institution == null) {
            var err = new Error('Institution not found');
            err.status = 404;
            return next(err);
        }
        res.render('books_by_institution', { title: 'You have access to the following books', institution: results.institution, institution_books: results.institution_books, 
        username: email} );
    });
})

// get request to display create form
router.get('/users/create', function(req, res) {
    console.log(req.query);

    if (Object.keys(req.query).length !== 0) {
        console.log("Attempt to add new user");

        //set default role as student because role doesn't get sent through for some reason.
        var user = new User (
            { name: req.query.name,
            email: req.query.email,
            role: "student",
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
                    res.redirect('/home/books?user=' + user.email);
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