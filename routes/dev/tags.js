const { Router } = require('express');
const router = Router();
const auth = require('../../middleware/auth');
const Tags = require('../../models/dev/tags');

router.get('/list', auth, async (req, res) => {
    try {
        const tags = await Tags.find();
        res.status(201).json({ message: 'ok', tags });
    } catch (e) {
        res.status(422).json({ message: 'tags not found' });
    }
});

router.post('/add', auth, async (req, res) => {
    const { name } = req.body;
    const candidate = Tags.findOne({ name });

    if (!candidate.name) {
        const newTag = new Tags({ name });
        try {
            await newTag.save();
            res.status(201).json({ message: 'tag added' });
        } catch (e) {
            res.status(422).json({ message: 'tag not added' });
        }
    } else {
        res.status(422).json({ message: 'tag already exists' });
    }
});

router.delete('/delete', auth, async (req, res) => {
    try {
        const { name } = req.body;

        await Tags.findOneAndDelete({ name });

        res.status(201).json({
            message: 'tag was deleted'
        });
    } catch (e) {
        return res.status(422).json({ message: 'not tag' });
    }
});

module.exports = router;