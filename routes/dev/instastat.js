const { Router } = require('express');
const router = Router();
const Instagram = require('../../models/instagram/instagramProfiles');

router.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.send('ok');
});

router.get('/accounts', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const profiles = await Instagram.find().select('name stats');
        res.status(201).json({ message: 'ok', profiles });
    } catch (e) {
        return res.status(422).json({ error: 'not accounts' });
    }
});

router.get('/account/:name', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const account = await Instagram.find({ name: req.params.name }).select('name stats countSubscribe countUnSubscribe tagLikes countLikes active tested private');
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