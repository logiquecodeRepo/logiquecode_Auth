const { lcAuthUsers } = require('../controller/lcAuthUsersController');
const ensureAuthentication = require('../Middlewares/Auth');

const router = require('express').Router();

router.post('/create', lcAuthUsers)

module.exports = router;