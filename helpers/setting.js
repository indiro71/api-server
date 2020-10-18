const Settings = require('../models/Setting');

module.exports = {
    async setting(name) {
        const setting = await Settings.findOne().where('name').equals(name);
        if (setting) return setting.value;

        return null;
    }
}