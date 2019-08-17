# drip, the open-source cycle tracking app

A menstrual cycle tracking app that's open-source and leaves your data on your phone. Use it to track your menstrual cycle and/or for fertility awareness!
Find more information on [our website](https://bloodyhealth.gitlab.io/).

The app is built in React Native and currently developed for Android.

Here --> you will find our [contributing guide](https://gitlab.com/bloodyhealth/drip/blob/master/CONTRIBUTING.md).

## Development setup

1.  Install [Android Studio](https://developer.android.com/studio/) - you'll need it to install some dependencies.

1.  Make sure you are running Node 10 (newer versions won’t work). It's easiest to switch Node versions using `nvm`, here’s how to do it:

    ```
    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    $ nvm install v10
    ```

1.  Clone this repository:

    ```
    $ git clone git@gitlab.com:bloodyhealth/drip.git
    $ cd drip
    ```
    and run
    ```
    $ npm install
    ```

1.  Open Android Studio and click on "Open an existing Android Studio project". Navigate to the drip repository you cloned and double click the android folder. It detects, downloads and cofigures requirements that might be missing, like the NDK and CMake to build the native code part of the project. Also see the [nodejs-mobile repository](https://github.com/janeasystems/nodejs-mobile) for the necessary prerequisites for your system.

1.  Either start a [virtual device in Android Studio](https://developer.android.com/studio/run/emulator) or [set your physical device like your Android phone up](https://developer.android.com/training/basics/firstapp/running-app) to run the app.

1.  Open a terminal and run
    ```
    $ npm run android
    ```

1.  To see logging output, run the following command in another tab: 
    ```
    $ npm run log
    ```

1.  Run the following command and select enable hot reloading (see https://facebook.github.io/react-native/docs/debugging.html):
    ```
    $ adb shell input keyevent 82
    ```

1.  We recommend installing an [ESLint plugin in your editor](https://eslint.org/docs/user-guide/integrations#editors). There's an `.eslintrc` file in this project which will be used by the plugin to check your code for style errors and potential bugs.

### Troubleshooting
#### [MacOS] Java problems

Make sure that you have Java 1.8 by running `java -version`.

If you don't have Java installed, or your Java version is different, the app may not work. You can try just using Android Studio's Java by prepending it to your `$PATH` in your shell profile:

```
$ export PATH="/Applications/Android Studio.app/Contents/jre/jdk/Contents/Home/bin:${PATH}"
```

Now, `which java` should output `/Applications/Android Studio.app/Contents/jre/jdk/Contents/Home/bin/java`, and the correct Java version should be used.

#### [MacOS] Ninja
If `npm` says `CMake was unable to find a build program corresponding to "Ninja".`:
    ```
    $ brew install ninja
    ```

### [MacOS] adb not on the path
If you get error messages about `adb` not being found on your path:
    ```
    $ ln -s ~/Library/Android/sdk/platform-tools/adb /usr/local/bin/adb
    ```

## Tests

### Unit tests
You can run the tests with:
```
$ npm test
```

### End to end tests
1. Check what testing device is specified in [package.json](https://gitlab.com/bloodyhealth/drip/blob/master/package.json) under:
```
{"detox":
 {"configurations":
  {"name": "NEXUS_DEVICE_OR_WHATEVER_SPECIFIED_DEVICE"}
  }
 }
}
```
2. Check if the current device is already installed on your machine. Go to `cd ~/Android/sdk/emulator/` or wherever you have Android installed on your machine. Here you can run `./emulator -list-avds` and compare the devices with the one you found in step 1.
3. Open Android Studio and go to -> Tools -> AVD manager -> `+Create virtual device` and select the device checked in the previous step
4. Use the emulator on your machine to run it without heavy Android Studio, e.g. in `~/Android/Sdk/emulator` OR chose to run the emulator within Android Studio
4.1 Here run: `$ ./emulator -avd NEXUS_DEVICE_OR_WHATEVER_SPECIFIED_DEVICE`
4.2 You might need to specify the following environment variables in your zsh or bash file according to where you have it installed:
```
export ANDROID_HOME="/home/myname/Android/Sdk"
export ANDROID_SDK_ROOT="/home/myname/Android/Sdk"
export ANDROID_AVD_HOME="/home/myname/.android/avd"
``` 
5. For the first time you need to get the app on the phone or if you run into this error:
`'app-debug-androidTest.apk' could not be found`
--> open a new 2nd tab and run (in your drip folder): `cd android and ./gradlew assembleAndroidTest`
Otherwise just open a new 2nd tab to run (in your drip folder) `npm run android`
6. Open a new 3rd tab to run `./node_modules/.bin/detox test -c android.emu.debug`

Hopefully you see the magic happening clicking through the app and happy test results on your console :sun_with_face: !

## Debugging
In order to see logging output from the app, run `npm run log` in a separate terminal. You can output specific code you want to see, with:
`console.log(theVariableIWantToSeeHere)`
or just a random string to check if this piece of code is actually running:
`console.log("HELLO")`.

## NFP rules
More information about how the app calculates fertility status and bleeding predictions in the [wiki on Gitlab](https://gitlab.com/bloodyhealth/drip/wikis/home)

## Adding a new tracking icon

1.  We use [fontello](http://fontello.com/) to create icon fonts for us. You need to upload the complete set of tracking icons (bleeding, cervical mucus, ...) including the new icon you wish to add, all in SVG.
2.  Download webfont from fontello
3.  Copy both the content of `config.json` and `font.tff` into `assets/fonts`, replacing it with the current content of `config-drip-icon-font.json` and `drip-icon-font.tff`.
4.  Now run the following command in your console:
    ```
    $ react-native link
    ```
5.  You should be able to use the icon now within drip, e.g. in Cycle Day Overview and on the chart.
