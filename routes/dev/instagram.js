const { Router } = require('express');
const router = Router();
const Instagram = require('../../models/instagram/instagramProfiles');
const InstaPost = require('../../models/instagram/instagramPosts');
const auth = require('../../middleware/auth');
const { uploadFile } = require('../../helpers/storage');

router.get('/list', async (req, res) => {
    try {
        const accounts = await Instagram.find({ private: false }).select('name stats');
        res.status(201).json({ message: 'ok', accounts });
    } catch (e) {
        return res.status(422).json({ message: 'not accounts' });
    }
});

router.get('/account/:name', async (req, res) => {
    try {
        const account = await Instagram.findOne({ name: req.params.name }).select('name stats countSubscribe countUnSubscribe tagLikes countLikes active tested private user title');
        const userId = req.user ? req.user.id : '';
        const canEdit = JSON.parse(JSON.stringify(account)).user === userId;

        if (!canEdit && account.private) {
            return res.status(422).json({ message: 'not account' });
        }

        const posts = await InstaPost.find({ profileId: account._id });

        res.status(201).json({
            message: 'ok',
            account: {
                canEdit,
                ...JSON.parse(JSON.stringify(account)),
                posts
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
        tagLikes: tagLikes.replace(/\s+/g, '').split(','),
        user: req.user.id
    });

    try {
        await newAccount.save();
        res.status(201).json({ message: 'account added', id: newAccount._id });
    } catch (e) {
        res.status(422).json({ message: 'account not added' });
    }
});

router.put('/edit/:id', auth, async (req, res) => {
    const { password, countLikes, tagLikes, active, tested, private: privates } = req.body;
    const account = await Instagram.findById(req.params.id);

    if (account.user != req.user.id) {
        return res.status(422).json({ message: 'not authorized' });
    }

    account.password = password ? password : account.password;
    account.countLikes = countLikes ? countLikes : account.countLikes;
    account.tagLikes = tagLikes.split(',').length > 0 ? tagLikes.replace(/\s+/g, '').split(',') : account.tagLikes;
    account.active = active;
    account.tested = tested;
    account.private = privates;

    try {
        await account.save();
        res.status(201).json({ message: 'account edit' });
    } catch (e) {
        return res.status(422).json({ message: 'account not edit' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const account = await Instagram.findOne({ _id: req.params.id });

        if (account.user != req.user.id) {
            return res.status(422).json({ message: 'not authorized' });
        }

        await account.delete();

        res.status(201).json({
            message: 'account was deleted'
        });
    } catch (e) {
        return res.status(422).json({ message: 'not account' });
    }
});

router.post('/post/', auth, async (req, res) => {
    const { title, description, imageUrl, tags, datePublish, profileId } = req.body;
    const profile = await Instagram.findById(profileId);

    if (profile.user != req.user.id) {
        return res.status(422).json({ message: 'not authorized' });
    }

    const image = 'https://storage.indiro.ru/instagram/' + imageUrl.split('/').pop();
    await uploadFile(imageUrl, 'instagram');

    const newPost = new InstaPost({
        title,
        description,
        imageUrl: image,
        tags,
        datePublish,
        profileId
    });

    try {
        await newPost.save();
        res.status(201).json({ message: 'post added' });
    } catch (e) {
        return res.status(422).json({ message: 'post not added' });
    }
});

router.delete('/post/:id', async (req, res) => {
    try {
        await InstaPost.findOneAndDelete({ _id: req.params.id });

        res.status(201).json({
            message: 'post was deleted'
        });
    } catch (e) {
        return res.status(422).json({ message: 'not post' });
    }
});

module.exports = router;