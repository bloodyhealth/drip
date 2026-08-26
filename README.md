## drip – open-source cycle tracking app

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

The app is built with React Native and runs on Android and iOS.

▶ [How to contribute to the project](https://gitlab.com/bloodyhealth/drip/blob/main/CONTRIBUTING.md)

▶ [How to release a new version](https://gitlab.com/bloodyhealth/drip/blob/main/RELEASE.md)

## Development setup

### 1. Clone this repository

Using SSH:

```bash
git clone git@gitlab.com:bloodyhealth/drip.git
```

Using HTTPS:

```bash
git clone https://gitlab.com/bloodyhealth/drip.git
```

---

## 2. Set up your environment

### 2.1 Node.js

Make sure you are running **Node 20** and **PNPM**.  
The easiest way to manage Node versions is via `nvm`. Follow the [NVM installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating), then restart your terminal.

From the project root, run:

```bash
nvm use
```

### 2.2 PNPM

**Option 1 – Use Corepack (recommended)**

Corepack is a Node script that lets you use package managers without installing them globally.  
Enable Corepack:

```bash
corepack enable
```

Verify that PNPM is available:

```bash
pnpm --version
```

**Option 2 – Install PNPM manually**

Follow the [PNPM installation docs](https://pnpm.io/installation).

### 2.3 React Native tooling

Follow the official React Native guide for setting up Android and iOS development:

- [React Native environment setup](https://reactnative.dev/docs/0.82/set-up-your-environment)

---

## 3. Run the app on Android

First, either:

- create and start an [Android virtual device](https://reactnative.dev/docs/0.82/set-up-your-environment) (see “Using a virtual device”), or
- [set up your Android phone](https://reactnative.dev/docs/0.82/running-on-device) to run the app.

From the project root:

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the Metro bundler** (keep this running in its own tab):

   ```bash
   pnpm start
   ```

3. **Build and run on Android**:

   ```bash
   pnpm android
   ```

4. **View logs** (optional, in another tab):

   ```bash
   pnpm log
   ```

5. **Clear cache** (if you previously had an older drip installation):

   ```bash
   pnpm clear
   ```

6. **Enable hot reloading**:

   ```bash
   adb shell input keyevent 82
   ```

We also recommend installing an [ESLint plugin in your editor](https://eslint.org/docs/user-guide/integrations#editors).  
The project includes an `.eslintrc` to help catch style issues and potential bugs.

---

## 4. Run the app on iOS

### 4.1 Install CocoaPods and dependencies

1. **Install JS dependencies**

   ```bash
   pnpm install
   ```

2. **Install iOS (CocoaPods) dependencies** from the project root:

   ```bash
   cd ios && bundle install && bundle exec pod install && cd ..
   ```

3. **Run the app**

   - Option A: open the `drip.xcworkspace` in Xcode and run “Build”.
   - Option B: from the project root:

     ```bash
     pnpm ios
     ```

4. If you build via Xcode, ensure the Metro bundler is running:

   ```bash
   pnpm start
   ```

---

## Troubleshooting

### macOS: `adb` not on the path

If you see errors about `adb` not being found:

```bash
ln -s ~/Library/Android/sdk/platform-tools/adb /usr/local/bin/adb
```

### Clearing project cache

Use the `clear` script to reset caches and/or reinstall libraries:

```bash
pnpm clear
```

Supported options:

- `all` – delete all caches and reinstall project libraries
- `ios` – delete iOS-related cache
- `android` – delete Android-related cache
- `cache` – purge Watchman, Metro bundler, Packager, and React caches
- `npm` – reinstall project libraries

For example, to clear the Android part of the project and reinstall libraries:

```bash
pnpm clear android npm
```

---

## Tests

### Unit tests

Run unit tests with:

```bash
pnpm test
```

### Manual testing

For manual QA of core functionality, see the [test protocol](https://gitlab.com/bloodyhealth/drip/-/snippets/2283405).

---

## NFP rules

Learn more about how drip calculates fertility status and bleeding predictions in the  
[NFP rules section of the GitLab wiki](https://gitlab.com/bloodyhealth/drip/wikis/home).

---

## Adding a new tracking icon

1. Use [fontello](http://fontello.com/) to generate icon fonts. Upload the full set of tracking icons (bleeding, cervical mucus, etc.), including the new icon you want to add, all as SVGs.
2. Download the webfont from fontello.
3. Copy `config.json` and `font.tff` into `assets/fonts`, replacing the current `config-drip-icon-font.json` and `drip-icon-font.tff`.
4. Run:

   ```bash
   react-native link
   ```

5. The new icon should now be available in drip (for example, in the Cycle Day overview and the chart).
