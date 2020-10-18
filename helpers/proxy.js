const tunnel = require('tunnel');
const { setting } = require('./setting');

module.exports = {
    async setProxy() {
        const ip = await setting('proxyIP');
        const tunnelingAgent = tunnel.httpsOverHttp({
            proxy: {
                host: ip.split(':')[0],
                port: ip.split(':')[1]
            }
        });

        return tunnelingAgent;
    }
}