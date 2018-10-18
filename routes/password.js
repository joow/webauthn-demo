const express = require("express");
const database = require("./database");
const utils = require("../utils");

const router = express.Router();

router.post("/register", (request, response) => {
  if (
    !request.body ||
    !request.body.username ||
    !request.body.password ||
    !request.body.name
  ) {
    response.json({
      status: "failed",
      message: "Request missing username, password or name"
    });

    return;
  }

  const { username, password, name } = request.body;

  if (database[username]) {
    response.json({
      status: "failed",
      message: `Username ${username} already exists`
    });

    return;
  }

  database[username] = {
    password: password,
    name: name,
    id: utils.randomBase64URLBuffer()
  };

  request.session.loggedIn = true;
  request.session.username = username;

  response.json({
    status: "ok"
  });
});

router.post("/login", (request, response) => {
  if (!request.body || !request.body.username || !request.body.password) {
    response.json({
      status: "failed",
      message: "Request missing username or password"
    });

    return;
  }

  const { username, password } = request.body;

  if (!database[username] || database[username].password !== password) {
    response.json({
      status: "failed",
      message: "Wrong username or password"
    });

    return;
  }

  request.session.loggedIn = true;
  request.session.username = username;

  response.json({
    status: "ok"
  });
});

module.exports = router;
