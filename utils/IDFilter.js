/**
 * token拦截器，用来拦截并种植新生成的token
 */

var Token = require('../models/Token');

var tokenFilter = function (req, res, next) {
  // there is no id, skip it.
  var token = req.cookies.SSOID;
  if (!token) {
    req.session.user = null;
    req.session.token = null;
    req.session.loginTime = null;
    return next();
  }

  Token.find({token: token}, function (err, tokens) {
    if (err) {throw err;}
    if (!tokens[0]) {
      req.session.user = null;
      res.setHeader('Set-Cookie', 'SSOID=;max-age=1;domain=vhost.com;path=/');
      return next();
    }
    req.session.user = tokens[0].username;
    req.session.token = tokens[0].token;
    req.session.loginTime = tokens[0].createTime;
    return next();
  });
};


module.exports = tokenFilter;
