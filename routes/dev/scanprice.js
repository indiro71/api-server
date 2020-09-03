const {Router} = require('express');
const router = Router();
const needle = require('needle');
const cheerio = require('cheerio')

const Shop = require('../../models/scanprice/Shop');
const Good = require('../../models/scanprice/Good');
const Price = require('../../models/scanprice/Price');

router.get('!/addshop', async (req, res) => {
    const shop = new Shop({
        name: 'ozon',
        url: 'ozon.ru',
        tagPrices: ['.sel-product-tile-price', '.c-pdp-price__old'],
        tagAvailable: '.available',
        tagName: 'h1'
    });

    try {
        await shop.save();
        res.status(201).json({status: 'add'});
    } catch (e) {
        console.log(e);
    }
});

router.get('/addgood', async (req, res) => {
    // const url = 'https://www.mvideo.ru/products/noutbuk-acer-aspire-3-a315-55g-53sk-nx-hnser-01c-30051126';
    const url = 'https://www.ozon.ru/context/detail/id/161057183/';
    const httpOptions = {};

    try {
        const shops = await Shop.find();
        const goodShop = shops.filter(shop => {
            return url.indexOf(shop.url) !== -1;
        });
        const shop = goodShop[0];

        if (shop) {
            if (shop.useCookie) {
                needle.get(url, function(err, response){
                    if (err) throw err;
                    httpOptions.cookies = response.cookies;
                });
            }

            needle.get(url, httpOptions, async function(err, response){
                if (err || response.statusCode !== 200)
                    throw err || response.statusCode;

                const $ = cheerio.load(response.body);
                const prices = shop.tagPrices.map(price => {
                    return parseInt($(price).text().replace(/\s/g, '').match(/\d+/))
                });
                const name = $(shop.tagName).text().replace(/\r?\n/g, "").trim();

                console.log(prices.filter(function(x) {
                    return x !== undefined && x !== null;
                }));

                const good = new Good({
                    name,
                    url: url,
                    shop: shop._id,
                    available: prices.length > 0,
                    currentPrice: Math.min.apply(null, prices),
                    minPrice: Math.min.apply(null, prices),
                    maxPrice:Math.min.apply(null, prices)
                });

                const candidate = await Good.findOne({name});

                if (candidate) {
                    return res.status(422).json({error: 'Good already exists'});
                }

                const dbGood = await good.save();
                const price = new Price({
                    price:  Math.min.apply(null, prices),
                    good: dbGood._id
                });

                await price.save();

                res.status(201).json({message: 'ok', status: response.statusCode});
            });
        }
    } catch (e) {
        console.log(e);
    }
});


router.get('/getpage', async (req, res) => {
    const cookiePage ='https://www.ozon.ru/';
    const page ='https://www.ozon.ru/context/detail/id/138355209/';
    const httpOptions = {};

    needle.get(cookiePage, function(err, response){
        if (err) throw err;
        // console.log(res.body);
        // console.log(res.statusCode);
        httpOptions.cookies = response.cookies;

    });

    needle.get(page, httpOptions, function(err, response){
        if (err || response.statusCode !== 200)
            throw err || response.statusCode;

        const $ = cheerio.load(response.body);
        const result = {
            title: $('h1').text(),
            price: $('.b1w5').text()
    };
        res.status(201).json({result, status: response.statusCode});
    });
});

module.exports = router;