const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const crypto = require("crypto");
const path = require("path");

const config = require("./config.json");
const defaultRoutes = require("./routes/default");
const passwordRoutes = require("./routes/password");
const webauthnRoutes = require("./routes/webauthn");

const app = express();

app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: [crypto.randomBytes(32).toString("hex")],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

app.use(express.static(path.join(__dirname, "static")));

app.use("/", defaultRoutes);
app.use("/password", passwordRoutes);
app.use("/webauthn", webauthnRoutes);

const port = config.port || 3000;
app.listen(port);
console.log(`App started on port ${port}`);

module.exports = app;
