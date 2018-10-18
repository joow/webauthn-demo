const express = require("express");
const database = require("./database");

const router = express.Router();

router.get("/isLoggedIn", (request, response) => {
  if (request.session.loggedIn) {
    response.json({
      status: "ok"
    });
  } else {
    response.json({
      status: "failed"
    });
  }
});

router.get("/logout", (request, response) => {
  request.session.loggedIn = false;
  request.session.username = undefined;

  response.json({
    status: "ok"
  });
});

router.get("/personalInfo", (request, response) => {
  if (request.session.loggedIn) {
    response.json({
      status: "ok",
      name: database[request.session.username].name,
      secret: '<img width="250px" height="250px" src="img/znk.png">'
    });
  } else {
    response.json({
      status: "failed",
      message: "Access denied"
    });
  }
});

module.exports = router;
