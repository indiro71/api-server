const puppeteer = require('puppeteer')

const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle0',
    timeout: 30000
};

module.exports = {
    async getPageContent(url) {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1920x1080',
                ]
            });
            console.log(url);
            const page = await browser.newPage();
            await page.goto(url, PAGE_PUPPETEER_OPTS);
            const content = await page.content();
            console.log(content)

            browser.close();
            return content;
        } catch (e) {
            throw e;
        }
    }
}
