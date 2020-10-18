const MainRouter = require("express").Router();
MainRouter.use("/auth", require('./auth'));
MainRouter.use("/links", require('./links'));
MainRouter.use("/qr", require('./qr'));
MainRouter.use("/scanprice", require('./scanprice'));
MainRouter.use("/instastat", require('./instastat'));
MainRouter.use("/settings", require('./settings'));

module.exports = MainRouter;