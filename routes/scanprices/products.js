const { Router } = require('express');
const router = Router();
const Parser = require('../../helpers/parser');

const { getShopByUrl, parseData } = require('../../helpers/scanprice');
const { uploadFile } = require('../../helpers/storage');
const auth = require('../../middleware/auth');

const Good = require('../../models/scanprice/Good');
const Price = require('../../models/scanprice/Price');
const Subscribe = require('../../models/scanprice/Subscribe');

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
        const product = await Good.findById(req.params.id).populate({ path: 'shop', select: 'name' });
        const prices = await Price.find().where('good').equals(req.params.id);
        let subscribe = undefined;
        if (req.user) {
            subscribe = await Subscribe.findOne().where('good').equals(req.params.id).where('user').equals(req.user.id);
        }

        res.status(201).json({
            message: 'ok',
            data: {
                params: product,
                prices,
                subscribe
            }
        });
    } catch (e) {
        return res.status(422).json({ error: 'not product' });
    }
});

router.post('/subscribe', auth, async (req, res) => {
    try {
        const subscribe = await Subscribe.findOne().where('good').equals(req.body.productId).where('user').equals(req.user.id);
        if (subscribe) {
            subscribe.price = req.body.price;
            await subscribe.save();
            res.status(201).json({ data: subscribe, message: 'Subscribe update' });
        } else {
            const newSubscribe = new Subscribe({
                price: req.body.price,
                good: req.body.productId,
                user: req.user.id
            });

            await newSubscribe.save();
            res.status(201).json({ data: newSubscribe, message: 'Subscribe added' });
        }
    } catch (e) {
        return res.status(422).json({ error: 'Subscribe not added' });
    }
});

router.post('/unsubscribe', auth, async (req, res) => {
    try {
        const subscribe = await Subscribe.findOne().where('good').equals(req.body.productId).where('user').equals(req.user.id);
        if (subscribe) {
            subscribe.price = req.body.price;
            await subscribe.delete();
            res.status(201).json({ data: subscribe, message: 'Subscribe delete' });
        } else {
            return res.status(422).json({ error: 'Subscribe not found' });
        }
    } catch (e) {
        return res.status(422).json({ error: 'Subscribe not added' });
    }
});

router.post('/scan', auth, async (req, res) => {
    const { url } = req.body;

    try {
        const shop = await getShopByUrl(url);
        if (shop) {
            const parser = new Parser();
            const content = await parser.getPageContent(url);
            await parser.closeBrowser();
            const data = parseData(content, shop, url);

            if (data) {
                res.status(201).json({ data });
            } else {
                return res.status(422).json({ error: 'some error' });
            }
        }
    } catch (e) {
        return res.status(422).json({ error: 'Product not added' });
    }
});

router.post('/add', auth, async (req, res) => {
    const { product, alertPrice } = req.body;

    try {
        if (product) {
            if (product.image && product.image !== '') {
                await uploadFile(product.image);
                product.image = product.image.split('/').pop();
            }
            product.user = req.user.id;

            const good = new Good(product);
            const candidate = await Good.findOne({ name: product.name });

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

            if (alertPrice) {
                const subscribe = new Subscribe({
                    price: alertPrice,
                    good: dbGood._id,
                    user: req.user.id
                });

                await subscribe.save();
            }

            res.status(201).json({ message: 'Product added', id: dbGood._id });
        } else {
            return res.status(422).json({ error: 'some error' });
        }
    } catch (e) {
        return res.status(422).json({ error: 'Product not added' });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const good = await Good.findOne({ _id: req.params.id });

        if (!good.user || good.user != req.user.id) {
            return res.status(422).json({ message: 'not authorized' });
        }

        good.delete();
        Price.deleteMany({ good: req.params.id });

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