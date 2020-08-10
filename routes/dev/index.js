const MainRouter = require("express").Router();
MainRouter.use("/auth", require('./auth'));
MainRouter.use("/links", require('./links'));

module.exports = MainRouter;