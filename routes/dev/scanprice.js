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

router.post('/addshop', async (req, res) => {
    const { name, url, tagPrices, tagAvailable, tagName, tagImage } = req.body;
    const shop = new Shop({
        name,
        url,
        tagPrices,
        tagAvailable,
        tagName,
        tagImage
    });

    try {
        await shop.save();
        res.status(201).json({ message: 'ok', status: 'shop added' });
    } catch (e) {
        return res.status(422).json({ error: 'Shop not added' });
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
                    const price = new Price({
                        price: good.currentPrice,
                        good: dbGood._id
                    });

                    await price.save();

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

module.exports = router;