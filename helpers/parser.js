const puppeteer = require('puppeteer');

const LAUNCH_PUPPETEER_OPTS = {
    headless: true,
    args: [
        '--no-sandbox',
        '--window-size=320,570',
        '--lang=en-EN,en',
    ]
};

class Parser {
    constructor() {
        this.browser = null;
    }
    async initBrowser() {
        this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    }
    closeBrowser() {
        this.browser.close();
    }
    async getPageContent(url) {
        if (!this.browser) {
            await this.initBrowser();
        }

        try {
            const page = await this.browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36');
            // await page.goto(url, { waitUntil: 'load' });
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            const content = await page.content();
            await this.closeBrowser();
            return content;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Parser;