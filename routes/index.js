var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.count) {
    req.session.count = 1;
  } else {
    req.session.count++;
  }
  res.render('index', {
    title: 'ID',
    username: req.session.user,
    count: req.session.count
  });
});


module.exports = router;
