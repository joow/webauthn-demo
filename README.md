# WebAuthn

> Sample app demo for WebAuthn.

Initially forked from [FIDO Alliance Demo](https://github.com/fido-alliance/webauthn-demo).

## Install

```shell
yarn
yarn start
```

## Usage

Open [http://localhost:3000](http://localhost:3000).

## Demo

### Hardware requirements

Ideally two FIDO2 certified security keys 😀
Otherwise two FIDO U2F certified security keys will do 😉

### Setup

1. Open iTerm in fullscreen with the "Demo" profile (Profiles>Demo)
2. Change the working directory to this one
3. Open a new terminal tab (again using Profiles>Demo)
4. Create a new "demo" profile in the browser (using `firefox -ProfileManager` for Firefox)
5. Close the welcome tabs
6. Setup the welcome page to remove all sections
7. Ignore the guided tour
8. Setup Qwant as search engine and deactivate search suggestions
9. Deactivate "Remember logins and passwords for sites"
10. Install the extension Krypton Authenticator
11. Pair the Krypton app with the extension
12. Setup VSCode to use "Light+" as theme
13. Setup VSCode font size to 18
14. Run KeepingYouAwake during the presentation

## License

See [LICENSE](./LICENSE).