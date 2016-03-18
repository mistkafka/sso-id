var login = document.getElementById('login');
var register = document.getElementById('register');
var logout = document.getElementById('logout');

if (login) {
  login.onclick = function () {
    var url = 'http://id.vhost.com/users/login?callback=http://' + location.host + location.pathname;
    location.replace(url);
  };
}

if  (register) {
  register.onclick = function () {
    var url = 'http://id.vhost.com/users/register?callback=http://' + location.host + location.pathname;
    location.replace(url);
  };
}

if (logout) {
  logout.onclick = function () {
    var url = 'http://id.vhost.com/users/logout?callback=http://' + location.host + location.pathname;
    location.replace(url);
  };
}
