const { Router } = require('express');
const router = Router();
const shortid = require('shortid');
const auth = require('../../middleware/auth');

const Link = require('../../models/dev/links');

router.get('/list', auth, async (req, res) => {
    try {
        const links = await Link.find().where('user').equals(req.user.id);
        res.status(201).json({ message: 'ok', links });
    } catch (e) {
        res.status(422).json({ message: 'links not found' });
    }
});

router.post('/add', auth, async (req, res) => {
    const { url } = req.body;
    const shortLink = shortid.generate();
    const newLink = new Link({
        url,
        shortLink,
        user: req.user.id
    });


    try {
        await newLink.save();
        res.status(201).json({ message: 'link added' });
    } catch (e) {
        res.status(422).json({ message: 'link not added' });
    }
});

router.get('/redirect/:code', async (req, res) => {
    try {
        const link = await Link.findOne({ shortLink: req.params.code });

        if (link) {
            link.views++;
            await link.save();
            return res.redirect(link.url);
        }

        res.status(404).json({ message: 'Link not found' });
    } catch (e) {
        res.status(500).json({ message: 'Error. Please repeat' });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const link = await Link.findOne({ _id: req.params.id });

        if (link.user != req.user.id) {
            return res.status(422).json({ message: 'not authorized' });
        }

        await link.delete();

        res.status(201).json({
            message: 'link was deleted'
        });
    } catch (e) {
        return res.status(422).json({ message: 'not link' });
    }
});

module.exports = router;