const {Router} = require('express');
const router = Router();
const needle = require('needle');
const tunnel = require('tunnel');

const {getShopByUrl, parseData} = require('../../helpers/scanprice');
const {setProxy} = require('../../helpers/proxy');

const Shop = require('../../models/scanprice/Shop');
const Good = require('../../models/scanprice/Good');
const Price = require('../../models/scanprice/Price');

router.get('/addshop', async (req, res) => {
    const {name, url, tagPrices, tagAvailable, tagName, tagImage} = req.body;
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
        res.status(201).json({message: 'ok', status: 'shop added'});
    } catch (e) {
        return res.status(422).json({error: 'Shop not added'});
    }
});

router.get('/addgood', async (req, res) => {
    const {url} = req.body;
    const httpOptions = {};

    try {
        const shop = await getShopByUrl(url);

        if (shop) {
            if (shop.useCookie) {
                httpOptions.agent = setProxy();
            }

            needle.get(url, httpOptions, async function(err, response){
                if (err || response.statusCode !== 200)
                    throw err || response.statusCode;

                const data = parseData(response.body, shop, url);

                if (data) {
                    const good = new Good(data);
                    const candidate = await Good.findOne({name: data.name});

                    if (candidate) {
                        return res.status(422).json({error: 'Good already exists'});
                    }

                    const dbGood = await good.save();
                    const price = new Price({
                        price:  good.currentPrice,
                        good: dbGood._id
                    });

                    await price.save();

                    res.status(201).json({message: 'ok', status: response.status});
                } else {
                    return res.status(422).json({error: 'some error'});
                }
            });
        }
    } catch (e) {
        return res.status(422).json({error: 'Good not added'});
    }
});


module.exports = router;