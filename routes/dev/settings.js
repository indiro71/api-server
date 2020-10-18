const { Router } = require('express');
const router = Router();
const Settings = require('../../models/Setting');

router.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.send('ok');
});

router.get('/all', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const settings = await Settings.find();
        res.status(201).json({ message: 'ok', settings });
    } catch (e) {
        return res.status(422).json({ error: 'not settings' });
    }
});

router.post('/add', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { name, value, type } = req.body;
    const setting = new Settings({
        name,
        value,
        type
    });

    try {
        await setting.save();
        res.status(201).json({ message: 'setting added', status: 'setting added' });
    } catch (e) {
        return res.status(422).json({ error: 'Setting not added' });
    }
});

router.get('/item/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const setting = await Settings.findById(req.params.id);
        res.status(201).json({
            message: 'ok', setting
        });
    } catch (e) {
        return res.status(422).json({ error: 'not setting' });
    }
});

router.put('/item/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { name, value } = req.body;
    const setting = await Settings.findById(req.params.id);
    setting.name = name;
    setting.value = value;

    try {
        await setting.save();
        res.status(201).json({ message: 'ok', status: 'setting edit' });
    } catch (e) {
        return res.status(422).json({ error: 'Setting not edit' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        await Settings.findOneAndDelete({ _id: req.params.id });

        res.status(201).json({
            message: 'setting was deleted'
        });
    } catch (e) {
        return res.status(422).json({ error: 'not setting' });
    }
});

module.exports = router;