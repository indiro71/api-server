module.exports = async function (req, res, next) {
    if (req.user) {
        return next();
    }

    return res.status(401).json({ message: 'Not authorized' });
}