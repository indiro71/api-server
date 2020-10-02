const cheerio = require('cheerio');
const Shop = require('../models/scanprice/Shop');


module.exports = {
    async getShopByUrl(url) {
        try {
            const shops = await Shop.find();

            const goodShop = shops.filter(shop => {
                return url.indexOf(shop.url) !== -1;
            });

            if (goodShop[0]) return goodShop[0];
            return null;
        } catch (e) {
            throw e;
        }
    },
    parseData(content, shop, url) {
        const $ = cheerio.load(content);
        const prices = shop.tagPrices.map(price => {
            if ($(price).text()) {
                if (shop.elementPrice) {
                    if ($(price).text().indexOf(shop.elementPrice) !== -1) {
                        return parseInt($(price).text().replace(/\s/g, '').match(/\d+/));
                    }
                    return null;
                }
                return parseInt($(price).text().replace(/\s/g, '').match(/\d+/));
            }
        }).filter(function(x) {
            return x !== undefined && x !== null;
        });

        const name = $(shop.tagName).text().replace(/\r?\n/g, "").trim();
        const image = $(shop.tagImage).attr('src').replace(/\r?\n/g, "").trim();

        if (name) {
            const good = {
                name,
                url: url,
                shop: shop._id,
                image,
                available: prices.length > 0,
                currentPrice: prices.length > 0 ? Math.min.apply(null, prices): 0,
                minPrice: prices.length > 0 ? Math.min.apply(null, prices): 0,
                maxPrice: prices.length > 0 ? Math.min.apply(null, prices): 0
            };

            return good;
        }
        return  null;
    }
}