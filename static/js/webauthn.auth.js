"use strict";

$("#register").submit(async event => {
  event.preventDefault();

  const name = event.currentTarget.name.value;
  const username = event.currentTarget.username.value;

  if (!name || !username) {
    alert("Name or username is missing!");
    return;
  }

  const formBody = { name, username };

  const response = await fetch("/webauthn/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  });
  const json = await response.json();
  const publicKey = preformatMakeCredReq(json);
  const publicKeyCreds = await navigator.credentials.create({ publicKey });
  const publicKeyCredsJson = publicKeyCredentialToJSON(publicKeyCreds);

  const registration = await sendWebAuthnResp(publicKeyCredsJson);

  if (registration.status === "ok") loadMainContainer();
  else
    alert(
      `Server responed with error. The message is: ${registration.message}`
    );
});

const sendWebAuthnResp = async body => {
  const response = await fetch("/webauthn/response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const json = await response.json();

  if (json.status !== "ok")
    throw new Error(
      `Server responed with error. The message is: ${json.message}`
    );
  return json;
};

$("#login").submit(async event => {
  event.preventDefault();

  const username = event.currentTarget.username.value;

  if (!username) {
    alert("Username is missing!");
    return;
  }

  const formBody = { username };
  const response = await fetch("/webauthn/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  });
  const json = await response.json();
  const publicKey = preformatGetAssertReq(json);
  const publicKeyCreds = await navigator.credentials.get({ publicKey });
  const publicKeyCredsJson = publicKeyCredentialToJSON(publicKeyCreds);

  const authentication = await sendWebAuthnResp(publicKeyCredsJson);

  if (authentication.status === "ok") loadMainContainer();
  else
    alert(
      `Server responed with error. The message is: ${authentication.message}`
    );
});
