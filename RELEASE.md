# How to release

drip is developed in React Native for iOS and Android and is released on 4 different platforms:

1. [Google Play Store](https://play.google.com/store/apps/details?id=com.drip)
2. [Apple App Store](https://apps.apple.com/us/app/drip/id1584564949)
3. [F-Droid](https://f-droid.org/packages/com.drip/)
4. [drip Website](https://dripapp.org)

In an ideal world the app version is the same across platforms. In reality this has never been the case.

Releasing a new version is very exciting and brings happy changes like fixing a bug, improving a feature, updating dependencies or adding a new functionality to the app. It is more than just pressing the button "publish new version".

_Note_: You need the release-key for Android to bundle a signed release that can be uploaded and published via the Google Play Store. A similar process for Apple requires a certificate to upload and publish the app to the App Store.

### Release steps

1. [Version updating](#Version-updating)
2. [Android builds](#Builds-in-Android)
3. [iOS builds](#Builds-in-iOS)
4. [User testing](#User-testing)
5. [Changelog](#Changelog)
6. [Release notes](#Release-notes)
7. [Release tag](#Release-tag)
8. [Phone screenshots](#Phone-screenshots)
9. [Publishing](#Publishing)
10. [Communication](#Communication)
11. [Self care](#Self-care)

## Version updating

When you are done with a chore, a feature or a bugfix, you may want to share it with testers and eventually publish a release. In order to identify a specific app version we can update the version name, which is created based on the following format: `1.yymm.d` e.g. `1.2311.7`. If you want to upload a new app version to Google Play you also need to update the version code.

The following command will:

- create a new versionName and a new higher versionCode (+1)
- create a commit including a tag named after the new release version name.

```
yarn release
```

The versionName and versionCode [are defined here](https://gitlab.com/bloodyhealth/drip/-/blob/5401789c46f4a02915ab900ef284581be420451c/android/app/build.gradle#L137-138) and in [package.json](https://gitlab.com/bloodyhealth/drip/-/blob/5401789c46f4a02915ab900ef284581be420451c/package.json#L3).

**Note for iOS**

Update the version number for iOS in `ios/drip/Info.plist` under:

```
<key>CFBundleShortVersionString</key>
<string>1.2403.19</string>
```

### Builds in Android

APK versus AAB

> Android App Bundles (AAB) include all your app’s compiled code and resources, but defer APK generation and signing to Google Play. Unlike an APK, you can't deploy an app bundle directly to a device. So, if you want to quickly test or share an APK with someone else, you should instead build an APK.

(https://developer.android.com/build/building-cmdline)

#### APK

To build a release apk file, run the following command:

```
yarn build-android-apk-release
```

_which is a shortcut for:_ `cd android && ./gradlew clean && ./gradlew assembleRelease && cd ..`

This will create a new apk file named `app-release.apk` under `./android/app/build/outputs/apk/release/`.

For signing an apk you can run this command:

```
yarn sign-android-apk-release
```

_which is a shortcut for:_ `zipalign -v -p 4 ./android/app/build/outputs/apk/release/app-release.apk ./android/app/build/outputs/apk/release/app-release_signed.apk`

It adds a file name `app-release_signed.apk` in the same folder in `./android/app/build/outputs/apk/release/`

#### AAB

To build a release aab file, run:

```
yarn build-android-aab-release
```

_which is a shortcut for:_ `cd android && ./gradlew clean && ./gradlew :app:bundleRelease && cd ..`

It creates a new aab file named `app-release.aab` under `./android/app/build/outputs/bundle/release`

For signing an aab you first need to configure the base module’s build.gradle file with your app’s signing information. You can then run this command:

```
yarn sign-android-aab-release
```

_which is a shortcut for:_ `jarsigner -keystore ./android/app/drip-release-key.keystore ./android/app/build/outputs/bundle/release/app-release.aab drip-release-key`

### Builds in iOS

To build an .ipa archive file for an upload to the AppStore you need to go to xCode and select Build -> "Any iOS Device" and under "Product" -> "Archive".

Once the archiving process has completed you can chose to do the following:

"Distribute the app"

- TestFlight & App Store for when you want to upload it for external testing and/or production release
- TestFlight Internal Only for when you want to upload it for internal testing

## User testing

To enable external testing you need to remember that Google Play and Apple App Store might take up to 1 day for their review process. "External testing" for iOS allows testing drip on Testflight anonymously via a public link. "Open testing" for Android allows testing drip on Google Play as beta tester below the normal production listing.

For a quick and easy way to share an apk to testers who are willing to sideload drip onto their Android phones, do this: Upload a signed apk to the Gitlab repository of the drip website under `/release` https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/-/tree/main/release and maybe adapt the name of the apk with a more specific name than "app-release.apk". Now you can simply share a direct link to download your newly bundled apk, e.g. [a download link for v1.2311.14](https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/-/blob/main/release/v1.2311.14.apk).

## Changelog

The [changelog](https://gitlab.com/bloodyhealth/drip/-/blob/main/CHANGELOG.md) should reflect the technical / code changes between a previous and the new version. Please update the changelog file with any relevant additions, fixes and changes in the following format:

**v1.yymm.d**

**Changes**

Changing the color of funky button
Updating a library from 1.2.3 to 2.3.4

**Adds**

New feature for calendar

**Fixed**

Small bug in chart

## Release notes

These notes are for the users and curious ones who may want to start using drip. They should be based on the changelog but written in a friendly and easy to understand way. The focus is on the user perspective and the impact of the changes for the user. Behind the scenes and in depth code changes are less relevant.

Google Play limits these notes to 500 characters, whereas Apple's App Store limits these notes to 4.000 characters. In Fdroid there are no release notes.

## Release tag

[Tags](https://gitlab.com/bloodyhealth/drip/-/tags) can mark a specific point in the coding/commmit history and helps us identify the version status of a released app. They are named "iOS-v1.2401.17" or "Release-v1.yymm.d".

## Phone screenshots

If there are visual changes in the app you may want to update the screenshots for the Google Play Store listing, which allows up to 8 and for Apple's App Store, which allows up to 10 screenshots. Keep in mind that both Google Play and Apple have specific resolution requirements. You'll find Google's in Grow -> Store presence -> Main Store Listing -> Phone screenshots and Apple's on the main App Store Connect site. Here is a link for [Apple's screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications).

Please also update [phone screenshots for the website](https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/-/tree/main/assets) and set links on [/index](https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/-/blob/f3da9776b1943ffa32458e74ef86eeca98c1891c/index.html#L47) and [/media](https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/-/blob/c7f999bb7ad736345321537cbffa3f4c24eeee6d/media.html#L33) that can then also be attached to a social media post.

## Publishing

### Google Play Console

Upload a signed aab to the [Google Play Console for developers](https://play.google.com/console/) and add it to the "App bundle explorer". This requires a higher versionCode and a different version name compared to previously uploaded aab or apk files.
You can decide if you want the new app version to get released for testing (internal, closed or open) or for production. Keep in mind that any track other than "internal testing" triggers an external review by Google and might take a few hours.

### Apple App Store Connect

Upload a new version and submit it for review, before it can be published.

### drip website

After a new version has been published on Google Play (or F-Droid) the apk version that is downloadable directly from the [drip website](https://dripapp.org) needs to get updated as well. Therefore you upload a signed apk to the [repository](https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/) as [we did in this commit](https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/-/commit/f8c0f90c1ae9f23bf8e1bc311790b85443149a4d),

and adapt the name and link on /index.html [as we did in this commit](https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/-/commit2f8850ff5fa78615a4f335b625ea4a67d4acf03a) and [this commit](https://gitlab.com/bloodyhealth/bloodyhealth.gitlab.io/-/commit/f3da9776b1943ffa32458e74ef86eeca98c1891c)
Last time I checked it was [here](f3da9776b1943ffa32458e74ef86eeca98c1891c/index.html#L114).

## Communication

You probably want to share the app update by posting on one or more of these platforms:

- [Twitter](twitter.com/dripberlin)
- [Mastodon](mastodon.social/@dripapp)
- [Ko-fi](https://ko-fi.com/dripapp)
- [Linkedin](https://www.linkedin.com/company/34899684/)
- Different tech, privacy, feminist oriented slacks

## Self care

Congratulations. Take a break, eat some chocolate, go see a live show of your favorite band, masturbate <3!
