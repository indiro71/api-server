const { Router } = require('express');
const router = Router();
const Instastat = require('../../models/Instastat');

router.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.send('ok');
});

router.get('/accounts', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const profiles = await Instastat.find();
        res.status(201).json({ message: 'ok', profiles });
    } catch (e) {
        return res.status(422).json({ error: 'not accounts' });
    }
});

router.get('/account/:username', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const account = await Instastat.find({ username: req.params.username })
        res.status(201).json({
            message: 'ok', data: {
                params: account
            }
        });
    } catch (e) {
        return res.status(422).json({ error: 'not account' });
    }
});

module.exports = router;