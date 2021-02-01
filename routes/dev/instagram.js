const { Router } = require('express');
const router = Router();
const Instagram = require('../../models/Instagram');
const auth = require('../../middleware/auth');

router.get('/list', async (req, res) => {
    try {
        const accounts = await Instagram.find({ private:false }).select('name stats');
        res.status(201).json({ message: 'ok', accounts });
    } catch (e) {
        return res.status(422).json({ message: 'not accounts' });
    }
});

router.get('/account/:name', async (req, res) => {
    try {
        const account = await Instagram.findOne({ name: req.params.name }).select('name stats countSubscribe countUnSubscribe tagLikes countLikes active tested private user');
        res.status(201).json({
            message: 'ok',
            account: {
                canEdit: JSON.parse(JSON.stringify(account)).user === req.user.id,
                ...JSON.parse(JSON.stringify(account))
            }
        });
    } catch (e) {
        return res.status(422).json({ message: 'not account' });
    }
});

router.post('/add', auth, async (req, res) => {
    const { name, password, countLikes, tagLikes } = req.body;
    const newAccount = new Instagram({
        name,
        password,
        countLikes,
        tagLikes: tagLikes.split(','),
        user: req.user.id
    });

    try {
        await newAccount.save();
        res.status(201).json({ message: 'account added', id: newAccount._id });
    } catch (e) {
        res.status(422).json({ message: 'account not added' });
    }
});

router.put('/edit/:id', async (req, res) => {
    const { password, countLikes, tagLikes, active, tested, private } = req.body;
    const account = await Instagram.findById(req.params.id);

    if (account.user != req.user.id) {
        return res.status(422).json({ message: 'not authorized' });
    }

    account.password = password ? password : account.password;
    account.countLikes = countLikes ? countLikes : account.countLikes;
    account.tagLikes = tagLikes.split(',').length > 0 ? tagLikes.split(',') : account.tagLikes;
    account.active = active;
    account.tested = tested;
    account.private = private;

    try {
        await account.save();
        res.status(201).json({ message: 'account edit' });
    } catch (e) {
        return res.status(422).json({ message: 'account not edit' });
    }
});

module.exports = router;