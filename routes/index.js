module.exports = function(app) {
    app.use("/dev", require('./dev/'));
};
