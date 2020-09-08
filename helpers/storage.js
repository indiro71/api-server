const needle = require('needle');
const keys = require("../keys");
const { setProxy } = require('./proxy');
const manager = require('node-selectel-manager')({
    login: keys.STORAGE_LOGIN,
    password: keys.STORAGE_PASSWORD
});

const storage = keys.STORAGE_NAME;
const defaultDirectory = `images`;

module.exports = {
    uploadFile(url, directory = defaultDirectory) {
        const httpOptions = {};
        const fileName = url.split('/').pop();
        httpOptions.agent = setProxy();

        needle.get(url, httpOptions, function (err, response) {
            if (err || response.statusCode !== 200)
                throw err || response.statusCode;

            if (response.body && fileName) manager.uploadFile(response.body, `${storage}/${directory}/${fileName}`);
        });
    }
}
