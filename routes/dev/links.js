const {Router} = require('express');
const router = Router();

router.get('/links', (req, res) => {
    res.send('Short links! This is test end');
});

module.exports = router;