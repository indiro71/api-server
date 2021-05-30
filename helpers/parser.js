const puppeteer = require('puppeteer');

class Parser {
    constructor(mobile = true, tested = false) {
        this.browser = null;
        this.page = null;
        this.mobile = mobile;
        this.tested = tested;
        this.user_mobile_agent = 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36';
        this.user_desktop_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';
    }
    async initBrowser() {
        const options = {};
        options.headless = !this.tested;

        options.defaultViewport = {
            width: this.mobile ? 320 : 1920,
            height: this.mobile ? 570 : 1080
        };

        options.args = [
            '--no-sandbox',
            '--lang=en-EN,en'
        ];

        if (this.useProxy) {
            options.args.push('--proxy-server=IP:PORT');
        }

        this.browser = await puppeteer.launch(options);
    }

    async wait(min = 0, max = 0) {
        if (min === 0) return false;

        await this.page.waitFor(max > 0 ? random.int(min, max) : min);
    }

    async newPage() {
        if (!this.page) {
            this.page = await this.browser.newPage();
        }

        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'en'
        });

        if (this.mobile) {
            await this.page.setUserAgent(this.user_mobile_agent);
        } else {
            await this.page.setUserAgent(this.user_desktop_agent);
        }
    }

    async closePage() {
        await this.page.close();
    }

    async closeBrowser() {
        this.browser.close();
    }
    async getPageContent(url) {
        if (!this.browser) {
            await this.initBrowser();
        }

        try {
            await this.newPage();
            // await this.wait(3000);
            await this.page.goto(url, { waitUntil: 'domcontentloaded' });
            // await this.wait(5000);
            const content =  await this.page.content();
            await this.closePage();
            return content;
        } catch (err) {
            await this.closeBrowser();
        }
    }
}

module.exports = Parser;