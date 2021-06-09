const CronJob = require('cron').CronJob;
const log4js = require("log4js");
const logger = log4js.getLogger('scanprice');
const Parser = require('../helpers/parser');

const Good = require('../models/scanprice/Good');
const Price = require('../models/scanprice/Price');
const { checkSubscribes } = require('../helpers/scanprice');

const { getShopByUrl, parseData } = require('../helpers/scanprice');

const scanPrice = new CronJob('0 * * * *', async function () {
    const parser = new Parser();
    try {
        const dbGoods = await Good.find();

        if (dbGoods) {
            for (const dbGood of dbGoods) {
                const url = dbGood.url;
                const shop = await getShopByUrl(url);

                if (shop) {
                    try {
                        const content =  await parser.getPageContent(url);
                        if (!content) return;

                        const good = parseData(content, shop, url);
                        if (good) {
                            if (good.currentPrice !== dbGood.currentPrice && good.currentPrice !== 0) {
                                if (good.available) {
                                    if (good.currentPrice < dbGood.currentPrice) {
                                        await checkSubscribes({...dbGood}, good.currentPrice);
                                    }
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
                    } catch (e) {
                        await parser.closeBrowser();
                        logger.error('Scanprices cron error', url, e);
                    }

                }
            }
            await parser.closeBrowser();
        }
    } catch (e) {
        await parser.closeBrowser();
    }
}, null, true, 'Europe/Moscow');

scanPrice.start();