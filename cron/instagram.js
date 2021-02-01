const CronJob = require('cron').CronJob;
const random = require('random');
const log4js = require("log4js");
const Instagram = require('../models/Instagram');
const instagram = require('../helpers/Instagram');
const {uploadLocalFile} = require("../helpers/storage");
const logger = log4js.getLogger('instaCron');


const test = async () => {
    try {
        const accounts = await Instagram.find();

        for (const account of accounts) {
            if (account.name && account.password && account.tagLikes.length > 0 && account.active) {
                const inst = new instagram(account);
                await inst.clickLikes();
            }
        }
    } catch (e) {
        console.log(e)
    }
};


const initInst = async () => {
    const acc = await Instagram.findOne().where('active').equals(true);
    if (acc) {
        const inst = new instagram(acc, false);

        await inst.initialize();
        await inst.login();

        await uploadLocalFile('/temp/afterLoginPage.png', 'instagram');
        logger.info('Instagram init');


        new CronJob('*/20 * * * *', async function () {
            const date = new Date();
            const hour = date.getHours();
            if (hour < 8) return;

            try {
                const randomInt = random.int(0, 6);
                logger.info('Instagram random init - ' + randomInt);
                if (randomInt === 5) {
                    logger.info('Start like clicked');
                    await inst.liked();
                    await uploadLocalFile('/temp/afterLike.png', 'instagram');
                    await uploadLocalFile('/temp/beforeLike.png', 'instagram');
                }
            } catch (e) {
                logger.error('Instagram error', e);
            }
        }, null, true, 'Europe/Moscow');
    }
}

module.exports = initInst;





