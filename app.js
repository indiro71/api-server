const express = require('express');
const path = require('path');

const app = express();

const devRoutes = require('./routes/dev');

app.use(express.urlencoded({extended: true}));

app.use('/dev', devRoutes);

async function  start() {
    try {
        const PORT = process.env.PORT || 7171;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    } catch (e) {
        console.log(e);
    }
}
start();

