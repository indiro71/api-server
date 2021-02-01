const { Router } = require('express');
const router = Router();
const auth = require('../../middleware/auth');

const Note = require('../../models/dev/notes');

router.get('/list', auth, async (req, res) => {
    try {
        const notes = await Note.find().where('user').equals(req.user.id);
        res.status(201).json({ message: 'ok', notes });
    } catch (e) {
        res.status(422).json({ message: 'notes not found' });
    }
});

router.get('/item/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id).select('name content user');

        if (note.user != req.user.id) {
            return res.status(422).json({ message: 'not authorized' });
        }

        res.status(201).json({
            message: 'ok', note
        });
    } catch (e) {
        return res.status(422).json({ message: 'not note' });
    }
});

router.post('/add', auth, async (req, res) => {
    const { name, content } = req.body;
    const newNote = new Note({
        name,
        content,
        user: req.user.id
    });

    try {
        await newNote.save();
        res.status(201).json({ message: 'note added' });
    } catch (e) {
        res.status(422).json({ message: 'note not added' });
    }
});

router.put('/edit/:id', async (req, res) => {
    const { name, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (note.user != req.user.id) {
        return res.status(422).json({ message: 'not authorized' });
    }

    note.name = name;
    note.content = content;

    try {
        await note.save();
        res.status(201).json({ message: 'note edit' });
    } catch (e) {
        return res.status(422).json({ message: 'note not edit' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id });

        if (note.user != req.user.id) {
            return res.status(422).json({ message: 'not authorized' });
        }

        await note.delete();

        res.status(201).json({
            message: 'note was deleted'
        });
    } catch (e) {
        return res.status(422).json({ message: 'not note' });
    }
});

module.exports = router;