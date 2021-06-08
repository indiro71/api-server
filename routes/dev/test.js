const { getWeatherByIp } = require('../../helpers/api/getWeather');
const { getLocation } = require('../../helpers/api/getLocation');
const { Router } = require('express');
const router = Router();

const Good = require('../../models/scanprice/Good');
const Price = require('../../models/scanprice/Price');
const Subscribe = require('../../models/scanprice/Subscribe');
const { checkSubscribes } = require('../../helpers/scanprice');

router.get('/', async (req, res) => {
    try {
        // const ip = '212.35.174.43';
        // // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // const data = await getWeatherByIp(ip);
        // res.status(201).json({ message: 'ok', data });
        const id = '60bfb17dc9340c22dc85616e';
        const product = await Good.findById(id).populate({ path: 'shop', select: 'name' });
        // console.log(product);


        await checkSubscribes(product, 3000);
        res.status(201).json({ message: 'ok' });

    } catch (e) {
        return res.status(422).json({ error: 'not settings' });
    }
});


module.exports = router;