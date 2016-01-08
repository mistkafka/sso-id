var db = require('./db');

var Token = db.model('tokens', {
  token: String,
  username: String,
  createTime: {type: Date, default: Date.now}
});

module.exports = Token;
