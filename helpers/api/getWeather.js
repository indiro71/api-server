const { getData } = require('../getData');
const keys = require('../../keys');
const apiUrls = require('./apiUrls');

module.exports = {
    async getWeatherByIp(ip) {
        try {
            if (!ip) return undefined;
            const {
                latitude,
                longitude
            } = await getData(`${apiUrls.GEO_SERVICE_URL}${ip}?access_key=${keys.LOCATION_API_KEY}`);
            return await getData(`${apiUrls.WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${keys.WEATHER_API_KEY}&units=metric`);
        } catch (e) {
            console.log(e);
        }
    },
    async getWeatherByCoords(lat, lon) {
        try {
            if (!lat || !lon) return undefined;
            return await getData(`${apiUrls.WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${keys.WEATHER_API_KEY}&units=metric`);
        } catch (e) {
            console.log(e);
        }
    },
};