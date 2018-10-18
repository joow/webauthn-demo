"use strict";

$("#register").submit(async event => {
  event.preventDefault();

  const name = event.currentTarget.name.value;
  const username = event.currentTarget.username.value;
  const password = event.currentTarget.password.value;

  if (!name || !username || !password) {
    alert("Name, username or password is missing!");
    return;
  }

  const formBody = { name, username, password };

  const response = await fetch("/password/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  });
  const json = await response.json();

  if (json.status === "ok") loadMainContainer();
  else alert(`Server responed with error. The message is: ${json.message}`);
});

$("#login").submit(async event => {
  event.preventDefault();

  const username = event.currentTarget.username.value;
  const password = event.currentTarget.password.value;

  if (!username || !password) {
    alert("Username or password is missing!");
    return;
  }

  const formBody = { username, password };
  const response = await fetch("/password/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  });
  const json = await response.json();

  if (json.status === "ok") loadMainContainer();
  else alert(`Server responed with error. The message is: ${json.message}`);
});
