const fetch = require("node-fetch");

module.exports = {
    async getData(url, method = 'GET') {
        try{
            const response = await fetch(url, {
                method
            });
            return await response.json();
        } catch (e) {
            console.log(e);
        }
    }
}