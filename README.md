# Hopper

While I was at Meta, I was introduced to an internally developed tool `bunnylol` and instantly fell in ❤️ with it.

Hopper is an open source version I developed for personal use because it is impossible to go back to typing full URLs in the address bar 😃.

This is configured to be hosted on Firebase which will deploy 1 function and 1 hosting website to enable hosting using a custom domain which is `rlchandani.me` in this case.

## Live

This is hosted live on [https://hopper.rlchandani.dev](https://hopper.rlchandani.dev).

## Available Commands

Visit [https://hopper.rlchandani.dev](https://hopper.rlchandani.dev) to see the list of available commands.

## Setup Hopper on Browser

1. Open `Chrome` > `Settings` > `Search Engines` > `Manage Search Engines`
2. Click `Add` under `Site search`
3. Type in following information in dialog and click `Save`
   - Search engine: `Hopper`
   - Shortcut: `hopper.rlchandani.com`
   - URL with %s in place of query: `https://hopper.rlchandani.dev/?search=%s`
4. Make this newly added custom site search as the default search engine.
5. All done! Now open a new tab and start using [available commands](https://hopper.rlchandani.dev)

### Use Hopper on Browser

1. Command can be used as it is to redirect to configured URL like `gh` will redirect to `https://github.com/`
2. Also, additional text can be added after the command to redirect to configured search URL like `gh rlchandani` will redirect to `https://github.com/search?q=rlchandani`

### Supported Browser

1. Chrome
2. Firefox
3. Safari
4. Any other browser that support custom site search

### Download and Build Locally (Mac)

> **Note**
> To enable debugging, when this code is hosted on an emulator, it will display the redirect URL in place of actually redirecting. If you want to change this behaviour, open `Hopper/functions/src/index.ts` and look for `if` condition using `process.env.FUNCTIONS_EMULATOR` and remove that `if` condition only keeping the `else` part in code. Enjoy!!!

1. You need `firebase cli` to run it using an emulator. Refer to [this guide](https://firebase.google.com/docs/cli) for installing it.
2. Clone this repo locally
3. You can use `Vistal Studio Code` to browser the code
4. Open Terminal and cd into `Hopper/functions` folder
5. Run `npm install`
6. Goto `Hopper` folder
7. Run `firebase emulators:start` to start the emulator hosting 1 firebase function and 1 hosting website and the output will look like below
   ![Firebase Start Emulator Logs](/images/firebase-start-emulator.png)
8. All done! Click on the link next to `hosting[hopper]: Local server:` pointing to server on `0.0.0.0` and it should serve available commands
9. To try redirect, append following query parameters to the hosting url `/?search=github%20rlchandani` and it should display the URL it will redirect to.
