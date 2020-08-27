const {Router} = require('express');
const QRCode = require('qrcode');
const router = Router();

router.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.send('ok');
});

router.post('/getcode', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    try {
        const {text, firstColor, secondColor} = req.body;
        const opts = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 0.3,
            margin: 1,
            color: {
                dark: firstColor.hex,
                light: secondColor.hex
            },
            width: 300,
            height: 300
        }
        const link = await QRCode.toDataURL(text, opts);
        res.status(201).json({link});
    } catch (err) {
        console.error(err)
    }
});

module.exports = router;