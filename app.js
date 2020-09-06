const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require("passport");
require('./cron/scanprice');

const app = express();

const {MONGODB_URI} = require('./keys');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


require('./routes')(app);

app.use(passport.initialize());
require("./config/passport")(passport);

async function  start() {
    try {
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
        const PORT = process.env.PORT || 7171;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    } catch (e) {
        console.log(e);
    }
}
start();

