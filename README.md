# drip, the open-source cycle tracking app

A menstrual cycle tracking app that's open-source and leaves your data on your phone. Use it to track your menstrual cycle and/or for fertility awareness!
Find more information on [our website](https://dripapp.org/).

[<img src="https://dripapp.org/assets/get.png"
     alt="Get it here"
     height="55">](https://dripapp.org/release/v1.2311.14.apk)
[<img src="https://dripapp.org/assets/badge_google-play.png"
     alt="Get it on Google Play"
     height="55">](https://dripapp.org/android)
[<img src="https://dripapp.org/assets/badge_app-store.png"
    alt="Get drip on the App Store"
    height="55">](https://dripapp.org/ios)
[<img src="https://dripapp.org/assets/badge_f-droid.png"
     alt="Get it on F-Droid"
     height="55">](https://dripapp.org/fdroid)

The app is built in React Native and developed for Android and iOS.

▶ [How to contribute to the project](https://gitlab.com/bloodyhealth/drip/blob/main/CONTRIBUTING.md)

▶ [How to release a new version](https://gitlab.com/bloodyhealth/drip/blob/main/RELEASE.md)

## Development setup

### 1. Get this repository

Clone it with SSH

    git clone git@gitlab.com:bloodyhealth/drip.git

or clone it with HTTPS

    git clone https://gitlab.com/bloodyhealth/drip.git

### 2. Node version

Make sure you are running Node 14 and classic yarn (v.1). It's easiest to switch Node versions using `nvm`, here's how to install NVM: https://github.com/nvm-sh/nvm#installing-and-updating. After installing nvm close the terminal and open it again to be able to use nvm.
Once you have nvm running you can install node 14:

    nvm install v14.19.3

#### On Apple Silicon M1

NodeJS 14 does not compile on the M1 architecture, so it has to be installed through Rosetta: https://devzilla.io/using-nodejs-14-with-mac-silicon-m1 .
To activate Rosetta and switch to intel emulation run:

    arch -x86_64 zsh

Run

    arch

again to verify that it returns "i386".
Now install node 14:

    nvm install v14.19.3

### 3. Yarn version

use npm to install yarn:

    npm install --global yarn

## for Android

### 3.1 Android Studio

Install [Android Studio](https://developer.android.com/studio/) - you'll need it to install some dependencies.

### 3.2 More requirements from Android Studio

Open Android Studio. If the message "SDK location not found" appears when you try to start it, edit `.bashrc` in your home directory by adding:

    export ANDROID_SDK_ROOT="$HOME/Android/Sdk"

Check by typing in your terminal:

    echo $ANDROID_SDK_ROOT

You should see the path of Sdk.
If you haven't installed [adb tools](https://developer.android.com/tools/adb) before, you will also have to do so and add to the .bashrc

    PATH="$PATH:$HOME/Android/Sdk/platform-tools"

In Android Studio click on "Open an existing Android Studio project". Navigate to the drip repository you cloned and double click the android folder. It detects, downloads and cofigures requirements that might be missing, like the NDK and CMake to build the native code part of the project.

### 3.3 Run the app on Android

Either create and start a [virtual device in Android Studio](https://developer.android.com/studio/run/emulator) or [set your physical device like your Android phone up](https://developer.android.com/training/basics/firstapp/running-app) to run the app.

i. Open a terminal, navigate to the drip folder and run

    yarn install

In a separate tab, that needs to keep running as long as you want to keep the app connected, run

    yarn start

Also run in a new tab

    yarn android

ii. To see logging output, run the following command in another tab:

    yarn log

iii. If you had an older version of drip before and you are now trying to run a new drip version, clear cache by running

    yarn clear

iv. Run the following command and select enable hot reloading (see https://facebook.github.io/react-native/docs/debugging.html):

    adb shell input keyevent 82

iv. We recommend installing an [ESLint plugin in your editor](https://eslint.org/docs/user-guide/integrations#editors). There's an `.eslintrc` file in this project which will be used by the plugin to check your code for style errors and potential bugs.

## for iOS

### 4.1 Install Cocoapods

"CocoaPods manages library dependencies for your Xcode projects"

    brew install cocoapods

### 4.2 Run app on iOS

Minimum system requirements to run iOS app are as follows:

- MacOS 10.15.7 for Mac users
- Xcode 13 (command line tools only might be enough)

i. Install yarn dependencies

    yarn install ..

ii. Install XCode dependencies by running the following command from the root project directory:

    cd ios && pod install && cd ..

iii. To run app either open drip workspace ('drip.xcworkspace' file) with XCode and run "Build" or run the following command:

    yarn ios

iiii. If you are building the app with XCode make sure you are running this as well:

    yarn start

### Troubleshooting

#### [MacOS M1] Flipper problems

If a bug in the currently used Flipper version prevents building the project, comment out the respective line in the podfile, like so:

    #use_flipper!()

Run

    pod install

from the ios directory again to reload the dependencies.

#### [MacOS] Java problems

Make sure that you have Java 1.8 by running `java -version`.

If you don't have Java installed, or your Java version is different, the app may not work. You can try just using Android Studio's Java by prepending it to your `$PATH` in your shell profile:
`$ export PATH="/Applications/Android Studio.app/Contents/jre/jdk/Contents/Home/bin:${PATH}"`

Now, `which java` should output `/Applications/Android Studio.app/Contents/jre/jdk/Contents/Home/bin/java`, and the correct Java version should be used.

#### [MacOS] Ninja

If `yarn` says `CMake was unable to find a build program corresponding to "Ninja".`:

    brew install ninja

### [MacOS] adb not on the path

If you get error messages about `adb` not being found on your path:

    ln -s ~/Library/Android/sdk/platform-tools/adb /usr/local/bin/adb

### Clearing project cache

If you would like to clear project cache and/or re-install project libraries, you can run clear script as follows:

    yarn clear

Script accepts the following options:
"all" - script will delete all caches and re-install project libraries,
"ios" - script will delete ios-related cache
"android" - script will delete android-related cache
"cache" - script will purge Watchman, Metrobundler, Pachager and React caches
"npm" - script will reinstall project libraries.

For example, if you would like to clear android part of the project and re-install project libraries, you can run the following command:

    yarn clear android npm

## Tests

### Unit tests

You can run the tests with:

    yarn test

### Manual testing

To ensure that core app functionality is working, we developed a [test protocol](https://gitlab.com/bloodyhealth/drip/-/snippets/2283405).

## Debugging

In order to see logging output from the app, run `yarn log` in a separate terminal. You can output specific code you want to see, with:
`console.log(theVariableIWantToSeeHere)`
or just a random string to check if this piece of code is actually running:
`console.log("HELLO")`.

## Known issues

### Android emulator

- Import/export to the local drive don't work.
- Email button on the Hamburger menu > About doesn't work - throws a yellow error message "Possible unhandled promise rejection...".

## NFP rules

More information about how the app calculates fertility status and bleeding predictions in the [wiki on Gitlab](https://gitlab.com/bloodyhealth/drip/wikis/home).

## Adding a new tracking icon

1.  We use [fontello](http://fontello.com/) to create icon fonts for us. You need to upload the complete set of tracking icons (bleeding, cervical mucus, ...) including the new icon you wish to add, all in SVG.
2.  Download webfont from fontello.
3.  Copy both the content of `config.json` and `font.tff` into `assets/fonts`, replacing it with the current content of `config-drip-icon-font.json` and `drip-icon-font.tff`.
4.  Now run the following command in your console:

        react-native link

5.  You should be able to use the icon now within drip, e.g. in Cycle Day Overview and on the chart.
