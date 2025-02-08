var express = require('express');
var router = express.Router();
let {create, getUser}  = require('../controller/userController')
let ensureAuthentication = require('../Middlewares/Auth');

/* GET home page. */
router.post('/CreateUser', create);
router.get('/GetUser', ensureAuthentication, getUser);
router.put('/editUser', ensureAuthentication, getUser);

module.exports = router;
