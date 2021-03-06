const { getData } = require('../getData');
const keys = require("../../keys");
const apiUrls = require("./apiUrls");

module.exports = {
    async getLocation(ip) {
        try {
            if (!ip) return undefined;
            return await getData(`${apiUrls.GEO_SERVICE_URL}${ip}?access_key=${keys.LOCATION_API_KEY}`);
        } catch (e) {
            console.log();
        }
    }
}