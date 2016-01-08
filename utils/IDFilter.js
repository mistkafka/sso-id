/**
 * token拦截器，用来拦截并种植新生成的token
 */

var http = require('http');

var tokenFilter = function (req, res, next) {

  // there is no id, skip it.
  var token = req.cookies.SSOID;
  if (!token) {
    req.session.user = null;
    return next();
  }

  var data = JSON.stringify({token: token});
  var options = {
    host: 'id.vhost.com',
    port: '80',
    path: '/users/verify-token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data, 'utf-8')
    }
  };

  var localReq = http.request(options, function (localRes) {
    var body = '';
    localRes.on('data', function (chunk) {
      body += chunk;
    });
    localRes.on('end', function () {
      body = JSON.parse(body);
      if (body.success != 'success') {
        req.session.user = null;
        res.setHeader('Set-Cookie', 'SSOID=;max-age=1;domain=vhost.com');
        return next();
      }
      var username = body.message;
      req.session.user = username;
      next();
    });
  });
  localReq.write(data);
  localReq.end();
};


module.exports = tokenFilter;
