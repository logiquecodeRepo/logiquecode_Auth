const router = require('express').Router();
const jwt = require('jsonwebtoken');
const tokenModel = require('../model/token');
require('dotenv').config();


router.post('/', async (req, res, next) => {
    try {
        const tokendata = req.body;
        const token = tokendata.params.token;
        if (!token) {
            console.log('token', token)
            return res.status(400).json({ message: "Token not found", success: false });
        }

        const dbToken = await tokenModel.findOne({ token });
        if (!dbToken) {
            return res.status(401).json({ message: "Auth failed due to token mismatch", success: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const tokenExReTime = dbToken.expiresAt;
        console.log('dbToken after compare: ', dbToken, 'decoded token: ', decoded, 'dbToken expiry: ', tokenExReTime);

        return res.status(200).json({ message: "Token validate successfully", success: true, decoded, tokenExReTime});
    } catch (err) {
        console.log('Error found in validateToken router: ', err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
})

module.exports = router;