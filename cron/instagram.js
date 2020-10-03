const CronJob = require('cron').CronJob;

const Instagram = require('../models/Instagram');
const inst = require('../helpers/instagram');

const instagramBot = new CronJob('*/30 * * * *', async function () {
    try {
        const accounts = await Instagram.find();

        accounts.map(async ({ name, password, countSubscribe, countUnSubscribe }) => {
            if (name && (countSubscribe || countUnSubscribe)) {
                await inst.initialize();
                await inst.login(name, password);

                if (countSubscribe) await inst.subscribe(countSubscribe);
                if (countUnSubscribe) await inst.unsubscribe(name, countUnSubscribe);

                await inst.close();
            }
        });
    } catch (e) {
        console.log(e)
    }
}, null, true, 'Europe/Moscow');

instagramBot.start();