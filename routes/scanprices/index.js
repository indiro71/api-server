const MainRouter = require("express").Router();
MainRouter.use("/products", require('./products'));
MainRouter.use("/shops", require('./shops'));

module.exports = MainRouter;