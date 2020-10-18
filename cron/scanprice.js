const CronJob = require('cron').CronJob;
const needle = require('needle');

const Good = require('../models/scanprice/Good');
const Price = require('../models/scanprice/Price');

const { getShopByUrl, parseData } = require('../helpers/scanprice');
const { setProxy } = require('../helpers/proxy');


const scanPrice = new CronJob('0 * * * *', async function () {
    const httpOptions = {};

    try {
        const dbGoods = await Good.find();

        dbGoods.map(async dbGood => {
            const url = dbGood.url;
            const shop = await getShopByUrl(url);

            if (shop) {
                if (shop.useProxy) {
                    httpOptions.agent = await setProxy();
                }

                needle.get(url, httpOptions, async function (err, response) {
                    if (err || response.statusCode !== 200)
                        throw err || response.statusCode;

                    const good = parseData(response.body, shop, url);

                    if (good) {
                        if (+good.currentPrice !== +dbGood.currentPrice) {
                            dbGood.currentPrice = good.currentPrice;
                            dbGood.dateUpdate = new Date().getTime();
                            dbGood.available = good.available;

                            if (good.currentPrice !== 0) {
                                const price = new Price({
                                    price: good.currentPrice,
                                    good: dbGood._id
                                });

                                await price.save();

                                if (good.currentPrice < dbGood.minPrice) {
                                    dbGood.minPrice = good.currentPrice;
                                }

                                if (good.currentPrice > dbGood.maxPrice) {
                                    dbGood.maxPrice = good.currentPrice;
                                }
                            }

                            await dbGood.save();
                        }
                    }
                });
            }
        });
    } catch (e) {
        console.log(e)
    }
}, null, true, 'Europe/Moscow');

scanPrice.start();