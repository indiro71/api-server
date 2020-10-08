const tunnel = require('tunnel');

module.exports = {
    setProxy() {
        const tunnelingAgent = tunnel.httpsOverHttp({
            proxy: {
                host: '139.180.215.133',
                port: 8888
            }
        });

        return tunnelingAgent;
    }
}