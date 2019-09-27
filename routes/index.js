/**
 * The default index route handler.
 * Responds to a request with body content to demonstrate the app is running as expected.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/test');
});

module.exports = router;