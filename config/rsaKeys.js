var fs = require('fs');

var signPrivateKey = fs.readFileSync('/root/.ssh/signPrivateKey', 'utf-8');
var encryptPublicKey = fs.readFileSync('/root/.ssh/encryptPublicKey.pub', 'utf-8');

exports.signPrivateKey = signPrivateKey;
exports.encryptPublicKey = encryptPublicKey;
