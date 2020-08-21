const MainRouter = require("express").Router();
MainRouter.use("/auth", require('./auth'));
MainRouter.use("/links", require('./links'));
MainRouter.use("/qr", require('./qr'));

module.exports = MainRouter;