const { Router } = require('express');
const router = Router();

const Shop = require('../../models/scanprice/Shop');

router.get('/all', async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(201).json({ message: 'ok', shops });
    } catch (e) {
        return res.status(422).json({ error: 'shop not selected' });
    }
});

router.get('/item/:id', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        res.status(201).json({
            message: 'ok', data: {
                params: shop
            }
        });
    } catch (e) {
        return res.status(422).json({ error: 'not shop' });
    }
});

router.post('/add', async (req, res) => {
    const { name, url, tagPrices: stringPrice, tagAvailable, tagName, tagImage, useProxy } = req.body;
    const tagPrices = stringPrice.split(',');
    const shop = new Shop({
        name,
        url,
        tagPrices,
        tagAvailable,
        tagName,
        tagImage,
        useProxy
    });

    try {
        await shop.save();
        res.status(201).json({ message: 'ok', status: 'shop added' });
    } catch (e) {
        return res.status(422).json({ error: 'Shop not added' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const shop = await Shop.findOneAndDelete({ _id: req.params.id });
        res.status(201).json({
            message: 'shop was deleted'
        });
    } catch (e) {
        return res.status(422).json({ error: 'not shop' });
    }
});

router.put('/edit/:id', async (req, res) => {
    try {
        const { name, url, tagPrices, tagImage, tagName } = req.body;
        const shop = await Shop.findById(req.params.id);

        shop.name = name;
        shop.url = url;
        shop.tagPrices = tagPrices;
        shop.tagImage = tagImage;
        shop.tagName = tagName;

        await shop.save();
        res.status(201).json({ message: 'shop edit' });
    } catch (e) {
        return res.status(422).json({ error: 'not shop' });
    }
});

module.exports = router;