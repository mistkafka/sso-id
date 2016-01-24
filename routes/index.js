var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'ID',
    ssoInfo: (req.flash('sso-info'))[0]
  });
});

module.exports = router;
