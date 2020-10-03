const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.instagram.com';

const instagram = {
    browser: null,
    page: null,

    initialize: async () => {
        instagram.browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === 'production',
            args: [
                '--no-sandbox',
                '--lang=en-EN,en'
            ]
        });

        instagram.page = await instagram.browser.newPage();

        await instagram.page.setExtraHTTPHeaders({
            'Accept-Language': 'en'
        });
    },

    login: async (name, password) => {
        await instagram.page.goto(`${BASE_URL}/accounts/login/?source=auth_switcher`, {waitUntil: 'networkidle2'});

        await instagram.page.type('input[name="username"]', name, {delay: 10});
        await instagram.page.type('input[name="password"]', password, {delay: 10});

        await instagram.page.click('button[type="submit"]');
        await instagram.page.waitForSelector('img[data-testid="user-avatar"]');
    },

    subscribe: async (count = 20) => {
        await instagram.page.goto(`${BASE_URL}/explore/people/suggested/`);
        await instagram.page.waitForSelector('button[type="button"]');

        const buttons = await instagram.page.$$('button[type="button"]');

        for (let i = 0; i < count; i++) {
            let button = buttons[i];

            await button.click();
        }
    },

    unsubscribe: async (profile, count = 20) => {
        await instagram.page.goto(`${BASE_URL}/${profile}/`);
        await instagram.page.waitForSelector('img[data-testid="user-avatar"]');

        const subsButton = await instagram.page.$x('//a[text()[contains(.,"following")]]');
        await subsButton[0].click();

        await instagram.page.waitForSelector('div[role="presentation"]');
        await instagram.page.waitForSelector('div[role="presentation"] li button[type="button"]');

        const buttons = await instagram.page.$$('div[role="presentation"] li button[type="button"]');

        for (let i = 0; i < count; i++) {
            let button = buttons[i];

            await button.click();
            await instagram.page.waitForSelector('div[role="presentation"]');

            const unsubButton = await instagram.page.$x('//button[text()[contains(.,"Unfollow")]]');
            await unsubButton[0].click();
        }
    },

    close: async () => {
        await instagram.browser.close();
    }
}

module.exports = instagram;