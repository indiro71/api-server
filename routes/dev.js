const {Router} = require('express');
const router = Router();

router.get('/links', (req, res) => {
    res.send('Short links');
});

router.get('/qr', (req, res) => {
    res.send('QR-codes');
});

router.get('/stat', (req, res) => {
    res.send('stat');
});

router.get('/test', (req, res) => {
    res.send('test');
});

module.exports = router;