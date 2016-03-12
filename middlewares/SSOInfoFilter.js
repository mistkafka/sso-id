/**
 * SSO的信息拦截器，用来生成统一的SSO界面信息
 * 需要放置在ID拦截器(IDFilter)之后
 */

var infoFilter = function (req, res, next) {
  console.log('SSOInfo Filter');
  req.flash('sso-info', {
    url: 'http://' + req.hostname + req.originalUrl,
    path: req.path,
    domain: req.hostname,
    user: req.session.user,
    token: req.session.token,
    loginTime: req.session.loginTime
  });
  return next();
};

module.exports = infoFilter;

