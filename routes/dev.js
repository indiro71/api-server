const {Router} = require('express');
const router = Router();

router.get('/links', (req, res) => {
    res.send('Short links');
});

router.get('/qr', (req, res) => {
    res.send('QR-codes');
});

module.exports = router;