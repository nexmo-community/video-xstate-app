# Vonage Video XState App

This application is a demonstration of the Vonage Video API using XState, Firebase and React.

## Requirements

The following will need to be created prior to running this demo app:

1. [Firebase account](https://console.firebase.google.com/)
    1. [Firebase CLI installed](https://firebase.google.com/docs/cli)
    1. [Firebase Project created](https://firebase.google.com/docs/projects/learn-more)
1. [Vonage Video account](https://tokbox.com/account/user/signup?icid=tryitfree_comm-apis_tokboxfreetrialsignup_nav)

## Working Locally

To test the application setup prior to deployment, follow these steps to get the application running locally.

### Set Up Configuration Files

#### .firebaserc

The `.firebaserc` file sets the default Firebase project. Rename the file with the following command:

```bash
mv example.firebaserc .firebaserc
```

Open `.firebaserc` and replace "YOUR-PROJECT-ID" with the project id found in the Firebase console by clicking `⚙️ -> Project Settings`.

```js
{
  "projects": {
    "default": "YOUR-PROJECT-ID"
  }
}
```

#### .runtimeconfig.json

The `.runtimeconfig.json` holds the local version of the Firebase functions conifguration.

Rename the example file:

```bash
/> mv ./functions/example-runtimeconfig.json ./functions/.runtimeconfig.json
```

Login to the [Vonage Video API dashboard](https://id.tokbox.com/login) and click `Projects -> Create New Project -> Create Custom Project`.

Copy and paste the project's `API KEY` and `API SECRET` into the `.runtimeconfig.json` file and update the values, then save.

```js
{
  "opentok": {
    "api_key": "",
    "api_secret": ""
  }
}
```

#### video-xstate-creds.json

The service account credentials are required from Google Cloud to run the Firebase emulators.

From the Firebase console, click `⚙️ -> Project Settings -> Service Accounts -> 5 service accounts from Google Platform`.

This will open the Google Cloud console. Locate the service account labeled `App Engine default service account`. Click `Actions -> Create Key` and select JSON and then click `create`.

Google Cloud creates the credentials and downloads them.  Locate the credentials file, and move it to the `functions` directory using the name `video-xstate-creds.json`.

```bash
/> mv ~/path/to/download/google-credentials.json ./functions/video-xstate-creds.json
```

#### .env

The frontend application requires environment variables using the `.env` file.

Rename the example file:

```bash
/> mv ./frontend/example.env ./frontend/.env
```

In the Firebase console, click `⚙️ -> Project Settings`. In the section `Your Apps`, click the `</>` to create a web application. Name this application `frontend` and select the option to `Also set up Firebase Hosting`.  Click `Register App -> Next -> Next -> Continue to console`.

Under the section `Firebase SDK Snippet`, click `Config`. Copy and paste the values into the `.env` file, as well as the Vonage Video `API KEY`

### Complete Firebase Setup

In the Firebase console, click `⚙️ -> Project Settings` and ensure the `Default GCP resource location` is set. Firebase supports `eur3` and `nam5` [locations](https://firebase.google.com/docs/firestore/locations#types).

Next click on `Database` in the left menu, and the `Create Database`. Start this in `Production` mode.

#### Update to Pay-As-You-Go

A recent change to Firebase now requires the project to be `pay-as-you-go`. Click `⚙️ -> Usage and Billing -> Details & Settings -> Modify Plan`.  Select the `Blaze` option and connect to the GCP billing account.

### Start Firebase Emulator

In a terminal window, navigate to the `functions` folder, install requirements and then start the Firebase Emulator:

```bash
/> cd functions
/> npm install
/> npm run serve
```

When successful, the terminal will print the location of the emulators.

### Start React Application Server

Open a second terminal window. Navigate the to the `frontend` folder, and install the requirements.

```bash
/> cd frontend
/> npm install
```

While the requirements are being installed, open `frontend/src/context/firebase.js` and uncomment line 24:

```js
functions.useFunctionsEmulator('http://localhost:4000');
```

Now start the React development server:

```bash
/> npm start
```

The browser should open to `localhost:3000`. Click `Create New Meeting` to verify local functions work.  This will use the production Firestore to store the data.

## Use In Production

### Firebase Environment Variables

The local environment should be created in the Firebase project.  Use the follow command with your Vonage Video `API KEY` and `API SECRET`:

```bash
/> firebase functions:config:set opentok.api_key="KEY" opentok.api_secret="SECRET"
```

### Deploy to Firebase

Before deploying, open `frontend/src/context/firebase.js` and comment line 24:

```js
//functions.useFunctionsEmulator('http://localhost:4000');
```

In the terminal window, use the following command to deploy the functions and web application.

```bash
/> firebase deploy --only functions,hosting
```

Once successful, the terminal will report the `Hosting URL`

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us know! You can either:

* Open an issue on this repository
* Tweet at us! We're [@NexmoDev on Twitter](https://twitter.com/NexmoDev)
* Or [join the Nexmo Community Slack](https://developer.nexmo.com/community/slack)
