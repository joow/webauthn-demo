const express = require("express");
const base64url = require("base64url");
const database = require("./database");
const utils = require("../utils");
const config = require("../config.json");

const router = express.Router();

router.post("/register", (request, response) => {
  if (!request.body || !request.body.name || !request.body.username) {
    response.json({
      status: "failed",
      message: "missing name or username!"
    });
    return;
  }

  const { name, username } = request.body;

  if (database[username] && database[username].registered) {
    response.json({
      status: "failed",
      message: "username already exists!"
    });
    return;
  }

  database[username] = {
    registered: false,
    id: utils.randomBase64URLBuffer(),
    name: name,
    authenticators: []
  };

  const challengeMakeCred = utils.generateServerMakeCredRequest(
    username,
    name,
    database[username].id
  );

  challengeMakeCred.status = "ok";
  request.session.challenge = challengeMakeCred.challenge;
  request.session.username = username;

  response.json(challengeMakeCred);
});

router.post("/login", (request, response) => {
  if (!request.body || !request.body.username) {
    response.json({
      status: "failed",
      message: "Request missing username field!"
    });

    return;
  }

  const username = request.body.username;

  if (!database[username] || !database[username].registered) {
    response.json({
      status: "failed",
      message: `User ${username} does not exist!`
    });

    return;
  }

  const getAssertion = utils.generateServerGetAssertion(
    database[username].authenticators
  );
  getAssertion.status = "ok";

  request.session.challenge = getAssertion.challenge;
  request.session.username = username;

  response.json(getAssertion);
});

router.post("/response", (request, response) => {
  if (
    !request.body ||
    !request.body.id ||
    !request.body.rawId ||
    !request.body.response ||
    !request.body.type ||
    request.body.type !== "public-key"
  ) {
    response.json({
      status: "failed",
      message:
        "Response missing one or more of id/rawId/response/type fields, or type is not public-key!"
    });

    return;
  }

  const webauthnResp = request.body;
  const clientData = JSON.parse(
    base64url.decode(webauthnResp.response.clientDataJSON)
  );

  // Check challenge...
  if (clientData.challenge !== request.session.challenge) {
    response.json({
      status: "failed",
      message: "Challenges don't match!"
    });
  }

  // ...and origin as well
  if (clientData.origin !== config.origin) {
    response.json({
      status: "failed",
      message: "Origins don't match!"
    });
  }

  let result;
  if (webauthnResp.response.attestationObject !== undefined) {
    // create cred
    result = utils.verifyAuthenticatorAttestationResponse(webauthnResp);

    if (result.verified) {
      database[request.session.username].authenticators.push(result.authrInfo);
      database[request.session.username].registered = true;
    }
  } else if (webauthnResp.response.authenticatorData !== undefined) {
    // get assertion
    result = utils.verifyAuthenticatorAssertionResponse(
      webauthnResp,
      database[request.session.username].authenticators
    );
  } else {
    response.json({
      status: "failed",
      message: "Can not determine type of response!"
    });
  }

  if (result.verified) {
    request.session.loggedIn = true;
    response.json({ status: "ok" });
  } else {
    response.json({
      status: "failed",
      message: "Can not authenticate signature!"
    });
  }
});

module.exports = router;
