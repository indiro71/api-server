const CronJob = require('cron').CronJob;
const needle = require('needle');
const cheerio = require('cheerio');

const Instastat = require('../models/Instastat');

const getInstaStat = new CronJob('0 23 * * *', async function () {
    try {
        const accounts = await Instastat.find();
        const httpOptions = {};

        for (let account of accounts) {
            const userUrl = `https://www.instagram.com/${account.username}/`;

            needle.get(userUrl, httpOptions, async function (err, response) {
                if (err || response.statusCode !== 200)
                    throw err || response.statusCode;

                const $ = cheerio.load(response.body);
                const data = $('meta[name="description"]').attr('content').split(', ');

                const followers = parseInt(data[0]);
                const following = parseInt(data[1]);
                const posts = parseInt(data[2]);
                const stats = { posts, followers, following, date: Date.now() };

                account.stats.push(stats);
                await account.save();
            });
        }
    } catch (e) {
        console.log(e)
    }
}, null, true, 'Europe/Moscow');

getInstaStat.start();
