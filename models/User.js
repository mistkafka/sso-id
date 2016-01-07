var db = require('./db');

var User = db.model('user', {
  username: String,
  password_hs: String
});

module.exports = User;
