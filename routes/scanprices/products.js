const { Router } = require('express');
const router = Router();
const Parser = require('../../helpers/parser');

const { getShopByUrl, parseData } = require('../../helpers/scanprice');
const { uploadFile } = require('../../helpers/storage')

const Good = require('../../models/scanprice/Good');
const Price = require('../../models/scanprice/Price');

router.get('/all', async (req, res) => {
    try {
        const products = await Good.find().populate('shop', 'name').select('name currentPrice url image');
        res.status(201).json({ message: 'ok', products });
    } catch (e) {
        return res.status(422).json({ error: 'products not selected' });
    }
});

router.get('/item/:id', async (req, res) => {
    try {
        const product = await Good.findById(req.params.id).populate('shop', 'name');
        const prices = await Price.find().where('good').equals(req.params.id);

        res.status(201).json({
            message: 'ok',
            data: {
                params: product,
                prices
            }
        });
    } catch (e) {
        return res.status(422).json({ error: 'not product' });
    }
});

router.post('/add', async (req, res) => {
    const { url } = req.body;

    try {
        const shop = await getShopByUrl(url);
        if (shop) {
            const parser = new Parser();
            const content = await parser.getPageContent(url);
            const data = parseData(content, shop, url);

            if (data) {
                if (data.image && data.image !== '') {
                    await uploadFile(data.image);
                    data.image = data.image.split('/').pop();
                }
                const good = new Good(data);
                const candidate = await Good.findOne({ name: data.name });

                if (candidate) {
                    return res.status(422).json({ error: 'Product already exists' });
                }
                const dbGood = await good.save();

                if (+dbGood.currentPrice !== 0) {
                    const price = new Price({
                        price: good.currentPrice,
                        good: dbGood._id
                    });

                    await price.save();
                }

                res.status(201).json({ message: 'Product added' });
            } else {
                return res.status(422).json({ error: 'some error' });
            }
        }
    } catch (e) {
        return res.status(422).json({ error: 'Product not added' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const good = await Good.findOneAndDelete({ _id: req.params.id });
        const prices = await Price.deleteMany({ good: req.params.id });

        res.status(201).json({
            message: 'good was deleted'
        });
    } catch (e) {
        return res.status(422).json({ error: 'not product' });
    }
});

router.get('/lastadded', async (req, res) => {
    try {
        const products = await Good.find().populate('shop', 'name').sort({ dateCreate: -1 }).limit(5);
        res.status(201).json({ message: 'ok', products });
    } catch (e) {
        return res.status(422).json({ error: 'products not selected' });
    }
});

router.get('/lastupdated', async (req, res) => {
    try {
        const products = await Good.find().sort({ dateUpdate: -1 }).limit(10);
        const prices = {};
        for (const product of products) {
            prices[product._id] = await Price.find().where('good').equals(product.id).sort({ date: -1 }).limit(2);
        }
        res.status(201).json({ message: 'ok', products, prices });
    } catch (e) {
        return res.status(422).json({ error: 'products not selected' });
    }
});

module.exports = router;