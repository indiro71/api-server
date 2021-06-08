const cheerio = require('cheerio');
const log4js = require("log4js");
const Shop = require('../models/scanprice/Shop');
const Subscribe = require('../models/scanprice/Subscribe');
const User = require('../models/User');
const keys = require('../keys');
const { sendMessage } = require('./api/sendgrid');
const logger = log4js.getLogger('scanpricesHelper');

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
            logger.error('getShopByUrl', e);
        }
    },
    parseData(content, shop, url) {
        try {
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
            const imageTag = 'meta[property="'+ shop.tagImage + '"]';
            let image = $(imageTag).attr('content');
            if (image) {
                image = image.replace(/\r?\n/g, "");
            }

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
        } catch (e) {
            logger.error('parseData', e);
        }
    },
    async checkSubscribes(product, price) {
        try {
            const subscribes = await Subscribe.find().where('good').equals(product._id);
            for (const subscribe of subscribes) {
                if (subscribe.price <= price) {
                    const user = await User.findById(subscribe.user);
                    const msg = {
                        to: user.email,
                        from: keys.EMAIL_FROM,
                        subject: 'Price Alert',
                        text: `Product ${product.name} currently costs ${product.currentPrice} RUB`,
                        html: `Product <i>${product.name}</i> currently costs <b>${product.currentPrice} RUB</b>`
                    }
                    await sendMessage(msg);
                }
            }
        } catch (e) {
            logger.error('checkSubscribes', e);
        }
    }
}