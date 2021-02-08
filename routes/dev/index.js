const MainRouter = require("express").Router();
MainRouter.use("/links", require('./links'));
MainRouter.use("/qr", require('./qr'));
MainRouter.use("/instagram", require('./instagram'));
MainRouter.use("/settings", require('./settings'));
MainRouter.use("/notes", require('./notes'));
MainRouter.use("/tags", require('./tags'));

module.exports = MainRouter;