var express = require('express');
var router = express.Router();
;
let {create, getUser}  = require('../controller/userController')
let ensureAuthentication = require('../Middlewares/Auth');

/* GET home page. */
router.post('/CreateUser', ensureAuthentication, create);
router.get('/GetUser', ensureAuthentication, getUser);
router


module.exports = router;
