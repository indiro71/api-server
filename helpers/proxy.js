const tunnel = require('tunnel');

module.exports = {
    setProxy() {
        const tunnelingAgent = tunnel.httpsOverHttp({
            proxy: {
                host: '95.174.67.50',
                port: 18080
            }
        });

        return tunnelingAgent;
    }
}