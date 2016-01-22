var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var url = 'http://' + req.hostname + req.originalUrl;
  res.render('index', {
    title: 'ID',
    user: req.session.user,
    token: req.session.token,
    loginTime: req.session.loginTime,
    path: req.path,
    domain: req.hostname,
    url: url
  });
});

module.exports = router;
