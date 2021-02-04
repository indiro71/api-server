const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const log4js = require("log4js");

const userMiddleware = require('./middleware/user');
const { MONGODB_URI } = require('./keys');
const initInst = require("./cron/instagram");
const logger = log4js.getLogger('server');

require('./cron/');
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userMiddleware);
require('./routes')(app);

app.use(passport.initialize());
require('./config/passport')(passport);
require('./config/log4js');


async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        const PORT = process.env.PORT || 7171;
        app.listen(PORT, () => {
            initInst();
            logger.info(`Server running on port ${PORT}...`);
            console.log(`Server running on port ${PORT}...`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();

