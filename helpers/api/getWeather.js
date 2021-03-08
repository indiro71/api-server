const { getData } = require('../getData');
const keys = require("../../keys");
const apiUrls = require("./apiUrls");

module.exports = {
    async getWeather(ip) {
        try {
            if (!ip) return undefined;
            const { latitude, longitude } = await getData(`${apiUrls.GEO_SERVICE_URL}${ip}?access_key=${keys.LOCATION_API_KEY}`);
            return await getData(`${apiUrls.WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${keys.WEATHER_API_KEY}&units=metric`);
        } catch (e) {
            console.log();
        }
    }
}