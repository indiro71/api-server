const puppeteer = require('puppeteer');

const LAUNCH_PUPPETEER_OPTS = {
    headless: true,
    args: [
        '--no-sandbox',
        '--window-size=320,570',
        '--lang=en-EN,en',
        // '--proxy-server=84.17.51.212:3128'
    ]
};

class Parser {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    async initBrowser() {
        this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
        this.page = await this.browser.newPage();
        await this.page.setUserAgent('Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36');
    }
    closeBrowser() {
        this.browser.close();
    }
    async getPageContent(url) {
        if (!this.browser) {
            await this.initBrowser();
        }

        try {
            await this.page.goto(url, { waitUntil: 'domcontentloaded' });
            let content = await this.page.content();
            return content;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Parser;