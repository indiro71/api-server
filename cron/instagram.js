const CronJob = require('cron').CronJob;

const Instagram = require('../models/Instagram');
const inst = require('../helpers/instagram');

const instagramBot = new CronJob('*/10 * * * *', async function () {
    try {
        const accaunts = await Instagram.find();

        accaunts.map(async accaunt => {
            const name = accaunt.name;
            const password = accaunt.password;

            if (name) {
                await inst.initialize();
                await inst.login(name, password);

                await inst.subscribe(20);
                await inst.unsubscribe(name, 8);

                await inst.close();
            }
        });
    } catch (e) {
        console.log(e)
    }
}, null, true, 'Europe/Moscow');

instagramBot.start();