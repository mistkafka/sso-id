
var db = require('./db');

var Client = db.model('client', {
  name: String,
  domain: String,
  isCrossDomain: Boolean,
  description: String,
  createTime: {type: Date, default: Date.now()},
  accessToken: String
});

module.exports = Client;
