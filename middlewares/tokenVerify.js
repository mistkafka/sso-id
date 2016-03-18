var redis = require('redis');
var client = redis.createClient('redis://redis:linzg123@master-id.redis.db:7000');

client.on('error', function (err) {
  console.log('redis error: ' + err);
});

module.exports = function (req, res, next) {
  var ssoToken = req.cookies.SSOID;
  
  if (!ssoToken) {
    res.locals.ssoInfo = null;
    return next();
  }
  
  client.hgetall(ssoToken, function (err, tokenInfo) {
    if (err) throw err;

    if (!tokenInfo) {
      res.locals.ssoInfo = null;
      res.locals.userInfo = null;
      return next();
    }

    res.locals.ssoInfo = tokenInfo;
    next();
  })
};
