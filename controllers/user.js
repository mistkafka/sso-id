var User = require('../models/User');
var hash = require('password-hash');
var rsaKeys = require('../config/rsaKeys');
var NodeRSA = require('node-rsa');
var tokenGenerator = require('random-token')
  .create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
var fetch = require('superfetch');
var Client = require('../models/Client');
var redis = require('redis');
var redisCli = redis.createClient('redis://redis:linzg123@master-id.redis.db:7000');
var userCtr = module.exports;


// vist forms
userCtr.loginForm =  function (req, res) {
  res.render('user/login', {
    title: 'Login',
    callback: req.query.callback
  });
}
userCtr.registerForm = function (req, res) {
  res.render('user/register', {
    title: 'Register',
    callback: req.query.callback
  });
}


/**
 * 种植Token
 * todo: 不对token进行验证，后期加入签名信息代替验证
 */
userCtr.plantToken =  function (req, res) {
  var token = req.query.token;
  var callback = req.query.callback;

  Client.find({isCrossDomain: true}, function (err, clients) {
    res.setHeader('Set-Cookie', 'SSOID=' + token + ';domain=vhost.com;path=/;HttpOnly');
    res.render('user/login-success', {
      title: 'login success',
      callback: callback,
      token: token,
      crossDomainClients: clients
    });
  });
}
// TODO:登录,退出的标志性信息需要统一,具体结合登录,身份验证
userCtr.logout = function (req, res) {
  var token = req.cookies.SSOID;
  if ((!token) || token=='') {
    res.redirect(req.query.callback || '/');
  }
  Client.find({}, function (err, clients) {
    if (err) throw err;

    req.session.user = null;
    req.session.token = null;
    req.session.loginTime = null;
    redisCli.del(token, function (err) {
      if (err) {throw err;}

      res.redirect(req.query.callback || '/');
    });
  });
}
userCtr.register = function (req, res) {
  var username = req.body.username;
  var password = req.body.password1;
  password = hash.generate(password);
  var newUser = new User({username: username, password_hs: password});
  newUser.save(function (err) {
    if (err) {throw err;}

    if (req.body.callback) {
      return res.redirect(req.body.callback);
    }
    res.redirect('/users/loginform');
  })
}
userCtr.auth = function (req, res, next) {
  User.find({username: req.body.username}, function(err, users) {
    if (err) {throw err;}

    if (hash.verify(req.body.password, users[0].password_hs)) {
      return next();
    }
    return res.redirect('/login?callback=' + req.body.callback);
  });
}
userCtr.generateToken = function (req, res) {
  var token = Date.now() + tokenGenerator(17);
  // todo: 采集更多token信息,包括:
  // 浏览器版本
  // ip
  // 地理位置
  // 操作系统型号
  // todo: 加密要跨域种植的token
  redisCli.hmset(token, ['account', req.body.username, 'loginTime', Date.now()], function (err, rslt) {
    if (err) throw err;
    var callback = req.body.callback || '/';
    var url = 'http://id.vhost.com/users/plant?callback=' + callback;
    url += '&token=' + token;
    res.redirect(url);
  });
}

// check utils
userCtr.userIsExits = function (req, res, next) {
    User.find({username: req.body.username}, function (err, user) {
      if (err) {throw err;}

      if (!user[0]) {
        console.log('err: user is not exist');
        return res.redirect('/');
      }
      return next();
    });
}

userCtr.userIsNotExits = function (req, res, next) {
  User.find({username: req.body.username}, function (err, user) {
    if (err) {throw err;}

    if (user[0]) {
      console.log('err: user is exist');
      return res.redirect('/');
    }
    return next();
  });
}

