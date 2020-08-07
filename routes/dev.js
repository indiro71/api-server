module.exports = function(app, db) {
    app.get("/", function(req, res) {
        res.redirect('index');
    });

    require("./dev/links")(app, db);

};