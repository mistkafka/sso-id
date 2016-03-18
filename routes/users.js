var express = require('express');
var router = express.Router();

var user = require('../controllers/user');

router.get('/loginform', user.loginForm);
router.get('/registerform', user.userIsNotExits, user.registerForm);
router.get('/logout', user.logout);
router.get('/plant', user.plantToken);
router.post('/login', user.userIsExits, user.auth, user.generateToken);
router.post('/register', user.userIsNotExits, user.register);

module.exports = router;
