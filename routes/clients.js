/**
 * 客户端管理
 */


var router = require('express').Router();

// 检验合法性
router.get('*', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  if (req.session.user != 'admin') {
    return res.end('Private Page!');
  }
  next();
});

// 访问管理界面
router.get('/', function (req, res) {
  var clients = []; // TODO: get clients
  var url = 'http://' + req.hostname + req.originalUrl;
  res.render('client/view', {
    title: 'SSO 客户端控制板',
    user: req.session.user,
    token: req.session.token,
    loginTime: req.session.loginTime,
    path: req.path,
    domain: req.hostname,
    url: url,
    clients: clients
  });
});

router.get('/add', function (req, res) {
});
router.post('/add', function (req, res) {
  
});

module.exports = router;
