const express = require('express');
const router = express.Router();
var User = require('../models/user');
var Institution = require('../models/institution');
var async = require('async');

// Sign in route.
router.get('/signin', async function (req, res) {
    //Use the passport library to authenticate a user and respond with a successful message that uses the JSend framework
    // async.parallel({
    //     user: function(callback) {
    //         User.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
    //     }
    // }, function(err, results) {
    //     res.render('index', { title: 'Local Library Home', error: err, data: results });
    // });
    // const user = 'Serene';
    // const title = 'Test';
    // data = {user, title};
    // res.render('index', data)
    res.send("TEST");
})

// Create route.
router.post('/create', async function (req, res) {
    //Creates a user and based on the user’s email domain links them to an institution. Denies creation of a user if their domain does not exist.
    res.send('Create a new user');
})

module.exports = router;