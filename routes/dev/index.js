const MainRouter = require("express").Router();
MainRouter.use("/auth", require('./auth'));
MainRouter.use("/links", require('./links'));
MainRouter.use("/qr", require('./qr'));
MainRouter.use("/scanprice", require('./scanprice'));
MainRouter.use("/instastat", require('./instastat'));

module.exports = MainRouter;