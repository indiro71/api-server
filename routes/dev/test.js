const { getWeatherByIp } = require('../../helpers/api/getWeather');
const { getLocation } = require('../../helpers/api/getLocation');
const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
    try {
        const ip = '212.35.174.43';
        // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const data = await getWeatherByIp(ip);
        res.status(201).json({ message: 'ok', data });
    } catch (e) {
        return res.status(422).json({ error: 'not settings' });
    }
});


module.exports = router;