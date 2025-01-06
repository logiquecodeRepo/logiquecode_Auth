const jwt = require('jsonwebtoken');
require('dotenv').config();
const ensureAuthentication = async (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).json({ message: "Unauthorized", success: false });
    }

    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET_KEY);
        req.body.userdata = decoded;
        req.user = {
            username: decoded.username
        };

        console.log('req.user: ', req.user);
        next();
    } catch (err) {
        console.log('Error found to verify token:', err);
        return res.status(500).json({ message: "Unauthorized", success: false })
    }
}

module.exports = ensureAuthentication;