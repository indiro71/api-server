const {Router} = require('express');
const router = Router();
const needle = require('needle');
const cheerio = require('cheerio')



router.get('/getpage', async (req, res) => {
    const cookiePage ='https://www.ozon.ru/';
    const page ='https://www.ozon.ru/context/detail/id/138355209/';
    const page2 ='https://www.mvideo.ru/products/smartfon-apple-iphone-11-pro-max-64gb-midnight-green-mwhh2ru-a-30045450';

    const httpOptions = {};

    // needle.get(cookiePage, function(err, response){
    //     if (err) throw err;
    //     // console.log(res.body);
    //     // console.log(res.statusCode);
    //     httpOptions.cookies = response.cookies;
    // });

    needle.get(page2, httpOptions, function(err, response){
        if (err || response.statusCode !== 200)
            throw err || response.statusCode;

        const $ = cheerio.load(response.body);
        const result = {
            title: $('h1').text(),
            // price: $('.b1w5').text()
            price: parseInt($('.c-pdp-price__current').text().replace(/\s/g, '').match(/\d+/))
        };
        res.status(201).json({result, status: response.statusCode});
    });

});

module.exports = router;