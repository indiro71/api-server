const CronJob = require('cron').CronJob;
const random = require('random');
const log4js = require("log4js");
const moment = require("moment");
const Instagram = require('../models/instagram/instagramProfiles');
const Post = require('../models/instagram/instagramPosts');
const instagram = require('../helpers/Instagram');
const logger = log4js.getLogger('instaCron');


const initInst = async () => {
    let worked = false;

    new CronJob('0 */3 * * *', async function () {
        const acc = await Instagram.findOne({active: true});

        if (acc && !worked) {
            const inst = new instagram(acc, false);

            try {
                await inst.initialize();
                await inst.login();
                if (!worked) {
                    worked = true;
                    logger.info('Start like clicked');
                    await inst.liked();
                    await inst.closeBrowser();
                    worked = false;
                }
            } catch (e) {
                logger.error('Instagram error', e);
            }
        }

    }, null, true, 'Europe/Moscow');

    new CronJob('58 */12 * * *', async function () {
        const acc = await Instagram.findOne({active: true});

        if (acc && !worked) {
            try {
                worked = true;
                logger.info('Start post shared');

                const post = await Post.findOne({profileId: acc._id, active: true, published: false, datePublish: moment().format('L')});
                if (post) {
                    const inst = new instagram(acc, false);
                    await inst.initialize();
                    await inst.login();
                    await inst.sharedPost(post);
                    await inst.closeBrowser();

                    post.published = true;
                    await post.save();
                }

                worked = false;
                logger.info('Finish post shared');
            } catch (e) {
                logger.error('Instagram error', e);
            }
        }
    }, null, true, 'Europe/Moscow');




}

module.exports = initInst;





