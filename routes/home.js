var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var User = require('../models/user');
var Institution = require('../models/institution');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var async = require('async');
        
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
function(username, password, done) {
    console.log("hello???");
    User.findOne({ "email": username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Email doesn\'t exist' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
        });
    }
));

router.post('/users/signin', function(req, res) {
    console.log("post request");
    passport.authenticate('local', { successRedirect: '/home/books?user=' + req.query.email,
                                     failureRedirect: '/home/users/signin',
                                     failureFlash: true })
    }
);

// get request to display signin form
router.get('/users/signin', function(req, res) {
    console.log("sign in: ", req.query);

    res.render('signin-user', { title: 'Sign In As An Existing User'});

    // if (Object.keys(req.query).length !== 0) {  

        //try to login existing user
        // User.findOne({ 'email': req.query.email }, 'password')
        //     .exec( function(err, password) {
        //         console.log(password.password)
        //         if (err) { 
        //             console.log(err)
        //             res.redirect('/home/users/signin');
        //             console.log("unable to login. Please try again"); 
        //         }

        //         if (!password) {
        //             console.log("email doesn't exist");
        //             // Email doesn't exist. Redirect to create user page.
        //             res.redirect('/home/users/create');
        //         }
                
        //         if (password.password === req.query.password) {
        //             res.redirect('/home/books?user=' + req.query.email);
        //         } else {
        //             console.log(err)
        //             res.redirect('/home/users/signin');
        //             console.log("incorrect password. Please try again"); 
        //         }
        // });
    // } else {
    //     res.render('signin-user', { title: 'Sign In As An Existing User'});
    // }
})

// get request to display create form
router.get('/users/create', function(req, res) {
    console.log("create: ", req.query);

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

        const domainStartIndex = user.email.indexOf("@") + 1;
        const email_domain = user.email.substring(domainStartIndex, user.email.length);
        
        async.parallel({
            institution: function(callback) {
                Institution.find({ "email_domain": email_domain})
                .exec(callback);
            },
        }, function(err, results) {
            if (err) { 
                console.log("error", err);
                return next(err);
            }

            if (results.institution.length <= 0) {
                console.log("institution not found");
                res.render('create-user', { title: 'Create New User', errorMsg: 'Your institution has not signed up to our service'});
            } else {
                console.log("domain exists");

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
            }
        });
        
    } else {
        res.render('create-user', { title: 'Create New User'});
    }
})

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

// get request to display list of books that the user has access to
router.get('/books', function(req, res) {
    const email = req.query.user;
    const domainStartIndex = email.indexOf("@") + 1;
    const institution = email.substring(domainStartIndex, email.length);

    async.parallel({
        institution: function(callback) {
            Institution.find({ "email_domain": institution})
              .exec(callback);
        },
    }, function(err, institution) {
        if (err) { 
            return next(err);
        }

        if (institution.institution.length <= 0) {
            var err = new Error('Institution not found');
            err.status = 404;
            return next(err);
        }
        
        async.parallel({
            institution_books: function(callback) {
                Book.find({"institutions": institution.institution[0].id})
                  .exec(callback);
            },
        }, function(err, books) {
            if (err) { 
                return next(err);
            }
            res.render('books', { title: 'You have access to the following books', institution: institution.institution[0], institution_books: books.institution_books, 
            username: email} );
        })

    });
})

module.exports = router;