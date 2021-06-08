const keys = require('../../keys');
const sgMail = require('@sendgrid/mail');

module.exports = {
    async sendMessage(msg) {
        sgMail.setApiKey(keys.SENDGRID_API_KEY);
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    }
};