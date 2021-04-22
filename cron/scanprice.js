const CronJob = require('cron').CronJob;
const Parser = require('../helpers/parser');

const Good = require('../models/scanprice/Good');
const Price = require('../models/scanprice/Price');

const { getShopByUrl, parseData } = require('../helpers/scanprice');

const scanPrice = new CronJob('0 * * * *', async function () {
    try {
        const dbGoods = await Good.find();

        if (dbGoods) {
            const parser = new Parser();

            for (const dbGood of dbGoods) {
                const url = dbGood.url;
                const shop = await getShopByUrl(url);

                if (shop) {
                    const content =  await parser.getPageContent(url);
                    const good = parseData(content, shop, url);

                    if (good) {
                        if (good.currentPrice !== dbGood.currentPrice && good.currentPrice !== 0) {
                            if (good.available) {
                                dbGood.currentPrice = good.currentPrice;
                            }
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
                }
            }
            await parser.closeBrowser();
        }
    } catch (e) {
        console.log(e)
    }
}, null, true, 'Europe/Moscow');

scanPrice.start();