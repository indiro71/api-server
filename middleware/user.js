const jwt = require('jsonwebtoken');
const keys = require('../keys');

module.exports = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return next();
            }

            const decoded = jwt.verify(token, keys.SESSION_SECRET);
            if (decoded) {
                req.user = decoded;
            }
        }

        next();
    } catch (e) {
        return res.status(401).json({ message: 'Authorize error' });
    }
}