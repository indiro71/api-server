const { Router } = require('express');
const router = Router();
const needle = require('needle');

const { getShopByUrl, parseData } = require('../../helpers/scanprice');
const { setProxy } = require('../../helpers/proxy');
const { uploadFile } = require('../../helpers/storage')

const Shop = require('../../models/scanprice/Shop');
const Good = require('../../models/scanprice/Good');
const Price = require('../../models/scanprice/Price');

router.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.send('ok');
});

router.get('/goods', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const goods = await Good.find();
        res.status(201).json({ message: 'ok', goods });
    } catch (e) {
        return res.status(422).json({ error: 'goods not selected' });
    }
});

router.get('/good/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const good = await Good.findById(req.params.id);
        const prices = await Price.find().where('good').equals(req.params.id);


        res.status(201).json({
            message: 'ok', data: {
                params: good,
                prices
            }
        });
    } catch (e) {
        return res.status(422).json({ error: 'not good' });
    }
});

router.post('/addgood', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { url } = req.body;
    const httpOptions = {};

    try {
        const shop = await getShopByUrl(url);

        if (shop) {
            if (shop.useProxy) {
                httpOptions.agent = setProxy();
            }

            needle.get(url, httpOptions, async function (err, response) {
                if (err || response.statusCode !== 200)
                    throw err || response.statusCode;

                const data = parseData(response.body, shop, url);

                if (data) {
                    if (data.image) {
                        uploadFile(data.image);
                        data.image = data.image.split('/').pop();
                    }

                    const good = new Good(data);
                    const candidate = await Good.findOne({ name: data.name });

                    if (candidate) {
                        return res.status(422).json({ error: 'Good already exists' });
                    }

                    const dbGood = await good.save();

                    if (dbGood.currentPrice !== 0) {
                        const price = new Price({
                            price: good.currentPrice,
                            good: dbGood._id
                        });

                        await price.save();
                    }

                    res.status(201).json({ message: 'Good added', status: response.status });
                } else {
                    return res.status(422).json({ error: 'some error' });
                }
            });
        }
    } catch (e) {
        return res.status(422).json({ error: 'Good not added' });
    }
});

router.delete('/good/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const good = await Good.findOneAndDelete({ _id: req.params.id });
        const prices = await Price.deleteMany({ good: req.params.id });

        res.status(201).json({
            message: 'good was deleted'
        });
    } catch (e) {
        return res.status(422).json({ error: 'not good' });
    }
});

router.get('/shops', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const shops = await Shop.find();
        res.status(201).json({ message: 'ok', shops });
    } catch (e) {
        return res.status(422).json({ error: 'shop not selected' });
    }
});

router.get('/shop/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
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

router.post('/addshop', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
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

router.delete('/shop/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const shop = await Shop.findOneAndDelete({ _id: req.params.id });
        res.status(201).json({
            message: 'shop was deleted'
        });
    } catch (e) {
        return res.status(422).json({ error: 'not shop' });
    }
});

module.exports = router;