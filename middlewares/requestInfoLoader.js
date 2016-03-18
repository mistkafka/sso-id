var  timeFormat = require('date-format');

/**
 * 生成一些访问信息,用来显示在信息面板上
 * Created by mistkafka on 3/18/16.
 */

module.exports = function (req, res, next) {
  var info = {
    domain: req.hostname,
    path: req.path,
    account: (res.locals.ssoInfo && res.locals.ssoInfo.account) || null,
    loginTime: (res.locals.ssoInfo && timeFormat('yyyy-mm-dd hh:mm:ss.SSS', new Date(parseInt(res.locals.ssoInfo.loginTime))) ) || null,
    ssoToken: req.cookies.SSOID
  };
  res.locals.reqInfo = info;

  return next();
}
