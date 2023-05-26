const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const product = require("./routes/Product.routes.js");
const user = require("./routes/User.routes.js");
const report = require("./routes/Report.routes.js");
const like = require("./routes/Like.routes.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", report);
app.use("/api/v1", like);

module.exports = app;
