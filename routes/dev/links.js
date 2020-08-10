const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.send('Short links! This is test end');
});

module.exports = router;