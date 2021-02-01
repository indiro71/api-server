module.exports = function(app) {
    app.use("/dev", require('./dev/'));
    app.use("/scanprices", require('./scanprices/'));
    app.use("/auth", require('./auth/'));
};
