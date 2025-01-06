const router = require('express').Router();
const {sendotp, verifyotp} = require('../controller/otpController');

router.post('/sendotp', sendotp);
router.post('/verifyotp', verifyotp);


module.exports = router;