# I solved it!

The solution was to use `FileReader` and convert the file to an `ArrayBuffer`. I've updated the repo with the solution. The trick was to `reader.readAsArrayBuffer(file);`, wait for a `load` event, and finally uploaded `reader.result` to Firebase. See `main.js` for the full solution.

**Note:** I will delete the Firebase project and only leave the code. If you want to test this you will need to and update the Firebase credentials (and rebuild the `.apk` if you want to test in Android). I will also remove any cordova files and only leave the `www` folder.

I will leave the error description below in case someone stumbles upon this.

# The problem

This is a Cordova test project to reproduce a bug when uploading files to Firebase using the WEB SDK on Android with an `<input type="file">`.

### Running the project

There is an `.apk` file in `./FirebaseUpload/platforms/android/build/outputs/apk/android-debug.apk`.

To remote debug:

1. Connect device via USB and make sure developer mode + debugging is enabled
2. Open Chrome dev tools and select `More tools > Remote devices`.
3. Select your device on the left, and inspect the webview.

To try this on a browser simply open `FirebaseUpload/www/index.html` in your browser.

To compile the `.apk` file:

1. Install Android SDK and Cordova with `sudo npm install -g cordova`
2. `cd FirebaseUpload`
3. `cordova build android --debug`

To compile and run the `.apk` on a connected device:

1. Install Android SDK and Cordova with `sudo npm install -g cordova`
2. `cd FirebaseUpload`
3. `cordova run android --device`

### Reproducing the error
Run the app in your Android device. Select a file to upload and wait.

When selectting a file from the downloads folder ir runs fine.

When selecting a file from the Drive folder the error will show up (even when the file is downloaded and available for offline use).

When uploading a file from the Drive folder to some website using the browser it works fine. For example to `www.imgur.com` It seems the problem is in the Firebase Web SDK.

When remote debugging with Chrome the error message is:
```
https://firebasestorage.googleapis.com/v0/b/test-upload-cordova.appspot.com…sbj4wEloO4Dffkf2_YAP8jQukZwSjyM4W4-C69Znqu6c92MA&upload_protocol=resumable
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

After a few tries a new error appears:

```
code: "storage/retry-limit-exceeded"
message: "Firebase Storage: Max retry time for operation exceeded, please try again."
```

<img src="error.jpg">

<img src="screenshot.png">

