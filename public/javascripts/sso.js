var login = document.getElementById('login');
var register = document.getElementById('register');
var logout = document.getElementById('logout');

login.onclick = function () {
  var url = 'http://id.vhost.com/users/login?callback=' + location.href;
  location.replace(url);
};

register.onclick = function () {
  var url = 'http://id.vhost.com/users/register?callback=' + location.href;
  location.replace(url);
};

logout.onclick = function () {
  var url = 'http://id.vhost.com/users/logout?callback=' + location.href;
  location.replace(url);
};

