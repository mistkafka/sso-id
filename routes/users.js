var express = require('express');
var router = express.Router();
var User = require('../models/User');
var hash = require('password-hash');
var rsaKeys = require('../config/rsaKeys');
var NodeRSA = require('node-rsa');
var Token = require('../models/Token');
var tinyCookie = require('tiny-cookie');



// visit "Login" page
router.get('/login', function (req, res) {
  res.render('user/login', {
    title: 'Login',
    callback: req.query.callback
  });
});

// check user exist
router.post('/login', function (req, res, next) {
  User.find({username: req.body.username}, function (err, users) {
    if (!users[0]) {
      return res.redirect('/');
    }
    next();
  });
});
// verify password
router.post('/login', function (req, res, next) {
  User.find({username: req.body.username}, function(err, users) {
    if (err) {throw err;}

    if (hash.verify(req.body.password, users[0].password_hs)) {
      return next();
    }
    return res.redirect('/login?callback=' + req.body.callback);
  });
});
// deal with login
router.post('/login', function (req, res) {

  // generate unique token
  var info = {
    username: req.body.username,
    timestamp: Date.now()
  };
  var signRSA = new NodeRSA(rsaKeys.signPrivateKey);
  var encryptRSA = new NodeRSA(rsaKeys.encryptPublicKey);
  var data = JSON.stringify(info);
  var signature = signRSA.sign(data, 'base64');
  var token = Date.now() + encryptRSA.encrypt(signature + '|' + data, 'base64');

  // store token
  // set up session
  // set up token on cookie
  // redirect to callback
  var newToken = new Token({
    token: token,
    username: req.body.username,
    createTime: Date.now()
  });
  newToken.save(function (err) {
    if (err) {throw err;}

    req.session.user = req.body.username;
    res.redirect((req.body.callback || '/') + '?token=' + token);
  });
});

router.get('/register', function (req, res) {
  res.render('user/register', {
    title: 'Register',
    callback: req.query.callback
  });
});

// check user exits
router.post('/register', function (req, res, next) {
  User.find({username: req.body.username}, function (err, user) {
    if (err) {throw err;}

    if (user[0]) {
      console.log('err: user is exist');
      return res.redirect('/');
    }
    next();
  });
});
// save new user
router.post('/register', function (req, res) {
  var username = req.body.username;
  var password = req.body.password1;
  password = hash.generate(password);
  var newUser = new User({username: username, password_hs: password});
  newUser.save(function (err) {
    if (err) {throw err;}

    if (req.body.callback) {
      return res.redirect(req.body.callback);
    }
    res.redirect('/users/login');
  })
});


// TODO: 后面再来完善检验机制
//router.route('/isexist')
//  .post(function (req, res) {
//    User.find({username:req.body.username}, function (err, user) {
//      if (err) throw err;
//
//      var rslt = {
//        success: 'success',
//        errMsg: ''
//      };
//      if (user) {
//        rslt.success = 'failed';
//      }
//      res.end(JSON.stringify(rslt));
//    })
//  });

module.exports = router;
