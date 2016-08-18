# embedded-tiles

A small app for displaying Power BI dashboard tiles on a dedicated website.

_Note: current version is not a finished system. Because of this, the names of the tiles to display are hardcoded into the file `public/scripts/tiles.js` and will most probably not work without modification on other dashboards._

## Quick guide

1. Make sure [Node.js and NPM](https://nodejs.org/en/) and [Git](https://git-scm.com/downloads) are installed
2. Clone the repo using HTTPS or SSH: `git clone https://github.com/Kugghuset/embedded-tiles.git`
3. Make sure global NPM packages are installes: `npm install -g babel-cli webpack gulp pm2`
4. From project root, install local NPM packages: `npm install`
5. Set up the _.env_ file with Azure credentials (and possibly edit `public/scripts/tiles.js` to use your own tile names).
6. Build the project: `npm run build`
7. Generate an app secret (and save it): `node manage.js --secret --save`
8. Create a _device_ and token: `node manage.js --generate-token --create`
9. Run the project: `gulp` or `npm run serve`
10. Navigate to the following URL using a web browser: `http://localhost:3000?token=<token_here>`

_NOTE: The URL may change depending on whether you modify the PORT and/or IP lines in the .env file._

---

## Getting started

The app is written in [ES2015 (JavaScript)](https://babeljs.io/docs/learn-es2015/), running a backend on [Node.js](https://nodejs.org/en/) and using [webpack](https://webpack.github.io/) in the front end. Of course, for cloning the repository, git is also necessary.

As the app is written in ES2015, instead of ES5, the code must be transpiled into ES5 before usage, which is handled by [babel](https://babeljs.io/) (for the backend) and [webpack](https://webpack.github.io/) (for the frontend). Luckily, these are via NPM, which makes it super easy to  manage.

### Requirements

Before the installing the necessary NPM packages, Node.js (and NPM) and Git must be installed on the machine, instructions can be found on their respective links:

- [Node.js and NPM](https://nodejs.org/en/)
- [Git](https://git-scm.com/downloads)

When both are installed, open up a terminal window (E.G. cmd.exe on Windows), and run the following commands (if you don't already have these installed, that is). For deployment, [pm2](https://github.com/Unitech/pm2) may also be of interest, as it lets Node apps to be run as daemons in the background and is excellent for running Node apps in production (whilst running a reverse proxy).

First clone the repo:

```bash
# HTTPS
git clone https://github.com/Kugghuset/embedded-tiles.git

# SSH
git clone git@github.com:Kugghuset/embedded-tiles.git

# cd into the repository folder
cd embedded-tiles
```

Then make sure `babel`, `webpack`, `gulp`, and `pm2` are installed. `pm2` is not required though.

```bash
npm install -g babel-cli webpack gulp pm2
```

After that from the project root, all local dependencies must be installed:

```bash
npm install
```

### Building the project

To build the project (transpile and bundle the JavaScript), there are a couple of commands.

#### Build app
```bash
npm run build
```

#### Build backend only

```bash
npm run build:server
```

#### Build frontend only

```bash
npm run build:frontend
```

In later iteration, a build command for packaging the app up for deployment will be added as well.

### The .env file

Before running the app, the _.env_ file must be created. The easiest way is to copy the _.env.example_ file to the project root and rename it to _.env_. Then it's just to fill in the your Azure Domain, Client ID, username (email). [More info here.](https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-register-a-web-app/).

The App Secret can be whatever you want, but can also be (randomly) generated using the `manage.js` file. More on that further down.

### Running the app

For purely running the app, `npm run serve` works just fine, for development I suggest running the default gulp command (`gulp`) which will transpile and bundle the frontend (JavaScript and SCSS), and transpile the server side JavaScript.

```bash
# Simply run the app, must be built first
npm run serve

# Builds, serves, and rebuilds on changes to files
gulp
```

### Authentication

The app uses an authentication system using a token based system, both for the initial navigation to the site and for making requests to the internal API. The token can be used either in the URL as a query param (`<URL>?token=<token>` or `<URL>?access_token=<token>`), as Authorization headers (`"Authorization": "Bearer <token>"`), or as a cookie (`Authorization=Bearer <token>`). These tokens are simple JSON Web Tokens, based on the _App Secret_ and a _device ID_ (devices are essentially like users). This means if the app secret is changed all previous tokens are invalid, and if a _device_ is removed, its token also gets invalid.

#### Generating an App Secret

To generate an App Secret, from project root type `node manage.js --secret` into the terminal and a string of random numbers and letters gets printed. This won't actually do anything until the new secret is saved to the .env file. Either you can do this, or you can use the follolwing command `node manage.js --secret --save`.

```bash
# Just print the secret
node manage.js --secret

# Print secret and update .env file
node manage.js --secret --save
```

_NOTE: the latter command **will** make every token invalid._

#### Managing _devices_

Currently, the system, is limited to only creating new _devices_ and listig existing _devices_.

To create a new _device_ to the database, simply type:

```bash
node manage.js --create
```

To list all _devices_ in the system, the use the following command.

```bash
node manage.js --list
```

#### Generating tokens

There are multiple ways of generating tokens. The two main ways is to generate tokens for existing _devices_, or creating a new device and generating a token for it:

```
# Generate token for existing device
node manage.js --generate-token --id <_id here>

# Create device and generate token for it
node manage.js --generate-token --create
```

### Considerations

As the project is currently mostly a proof of concept app, the tiles to display are hardcoded by name in the file `public/scripts/tiles.js`, thus the project _most problaby_ won't do much without modifications to that file (currently lines 23 - 29).

No actual database is used as of now, so devices are saved into the `.db.json` file in the project root.
