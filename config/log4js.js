const log4js = require("log4js");

log4js.configure(
    {
        appenders: {
            file: {
                type: 'file',
                filename: 'logs/logger.log',
                maxLogSize: 10 * 1024 * 1024, // = 10Mb
                encoding: 'utf-8',
                mode: 0o0640,
                flags: 'w+'
            }
        },
        categories: {
            default: { appenders: ['file'], level: 'trace' }
        }
    }
);