var express = require('express');
var router = express.Router();
var User = require('../models/User');
var hash = require('password-hash');
var rsaKeys = require('../config/rsaKeys');
var NodeRSA = require('node-rsa');
var Token = require('../models/Token');
var tokenGenerator = require('random-token')
  .create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
var fetch = require('superfetch');


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
  var token = Date.now() + tokenGenerator(17);
  var newToken = new Token({
    token: token,
    username: req.body.username,
    createTime: Date.now()
  });
  newToken.save(function (err) {
    if (err) {throw err;}

    req.session.user = req.body.username;
    req.session.token = token;
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

// server2server API: verify token
router.post('/verify-token', function (req, res) {
  var token = req.body.token;
  console.log(token);
  Token.find({token:token}, function (err, tokens) {
    if (err) {throw err;}

    var rslt = {success: 'failed', message: 'Invalid Token'};
    if (tokens[0]) {
      rslt.success = 'success';
      rslt.message = tokens[0].username;
    }
    res.end(JSON.stringify(rslt));
  })
});

router.get('/logout', function (req, res) {
  if (!req.session.user) {
    return res.redirect(req.query.callback || '/');
  }
  var token = req.session.token;
  req.session.user = null;
  req.session.token = null;
  Token.remove({token:token}, function (err) {
    if (err) {throw err;}
    console.log('token:' + token + '   removed');
    res.redirect(req.query.callback || '/');
  });

  // remove session from all client-app
  //fetch.get('http://music.vhost.com/logout?outToken=' + token);
  //fetch.get('http://news.vhost.com/logout?outToken=' + token);

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
