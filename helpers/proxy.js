const tunnel = require('tunnel');

module.exports = {
    setProxy() {
        const tunnelingAgent = tunnel.httpsOverHttp({
            proxy: {
                host: '51.38.155.118',
                port: 3128
            }
        });

        return tunnelingAgent;
    }
}