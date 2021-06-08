const keys = require('../../keys');
const { SMSRu } = require('node-sms-ru');

module.exports = {
    async sendSms(smsData) {
        const smsRu = new SMSRu(keys.SMSRU_API_KEY);
        try {
            const sendResult = await smsRu.sendSms(smsData);
            return sendResult;
        } catch (error) {
            console.error(error);
        }
    }
};