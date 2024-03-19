# Changelog

All notable changes to this project will be documented in this file.

## v1.2403.19 Android & iOS

### Changes

- Disables temperature slider if temperature tracking off
- Disables secondary symptom if fertility and or cervix/cervical mucus are off
- Disables temperature reminder if temperature tracking off
- Disabled period reminder if period predictions off
- Return from sympto adapter if fertility off
- Restructure settings menu
- Unify wording to "sympto-thermal method"
- Format decimal to x.0 instead of x.00 used for standard deviation and average cycle in stats
- Use SelectTabGroup for secondary symptom customization

- Android changes after updating React Native to 0.68.3
- Update Android Gradle plugin from 7.0.3 to 7.0.4
- Update NDK to "24.0.8215888" only for M1 users which added support for aarch64
- Update metadata phone screenshots for Fdroid store listing
- Updated dependencies:
  - @react-native-community/datetimepicker from 6.3.1 to 7.2.0
  - @react-native-async-storage/async-storage from ^1.17.9 to ^1.18.2
  - metro-react-native-babel-preset from ^0.66.2 to ^0.67.0

### Adds

- Customization settings can turn on & off:

  - Tracking categories
  - Period predictions
  - Fertility phases calculation

- Home displays text elements depending on customization settings
- Chart displays tracking category elements depending on customization settings
- CycleDay displays tracking category elements and exclude switch depending on customization settings
- Reminder can be disabled depending on customization settings
- Adds disabled and more styling to AppSwitch
- Adds TrackingCategorySwitch
- Adds disabled, more styling and alert to SelectTabGroup
- Adds more marginTop to License page
- Adds info text to Password menu item in Settings

## v1.2401.17 iOS

### Changes

- Updating React Native to 0.68.3
- Minor changes in temperature chart

### Adds

- Temperature scale slider
- out of range warning messages for temperature values

### Fixed

- Order of import buttons

## v1.2312.11 iOS

### Changes

- Chart: Improved readability
  - Finer temperature lines and dots
  - Enlarge screen space for temperature chart
  - A very light grey background color for weekend days on the whole chart screen
- Homescreen: date displayed in new format
- Minor changes in "about" section

See more under v1.2311.14 Android

### Adds

- Stats: Show period details, including cycle start, cycle length and amount of days with bleeding
- Stats: Explainer text for standard deviation
- App asks for permissions for notifications right at the start, which allows you to set reminders (this is a new requirement for Android 13)

## v1.2311.14 Android

### Changes

- Make the app compatible with Android 13
  - Update Android's targetSdkVersion to 33
  - Update buildToolsVersion to 33.0.2
  - Update Android Gradle plugin to 7.0.3
  - Update Gradle to 7.3.3
  - Update kotlinVersion to 1.3.40
- Chart: Improved readability
  - Finer temperature lines and dots
  - Enlarge screen space for temperature chart
  - A very light grey background color for weekend days on the whole chart screen
- Reminders:
  - Use new fork of react-native-push-notification: <https://github.com/github:bl00dymarie/react-native-push-notification> without google services
  - Adding channels after breaking changes in react-native-push-notification
- Homescreen: date displayed in new format
- Minor changes in "about" section
- Updated dependencies:
  - moment ^2.29.4,
  - prop-types ^15.8.1,
  - react v17.0.2,
  - react-native v0.67.4,
  - react-native-calendars ^1.1287.0,
  - react-native-document-picker ^8.1.1,
  - react-native-fs ^2.20.0,
  - react-native-modal-datetime-picker v14.0.0,
  - react-native-share ^7.9.0,
  - react-native-vector-icons ^9.2.0,
  - realm ^10.16.0,
  - sympto v3.0.1

### Adds

- Stats: Show period details, including cycle start, cycle length and amount of days with bleeding
- Stats: Explainer text for standard deviation
- Settings: Privacy Policy
- App asks for permissions for notifications right at the start, which allows you to set reminders (this is a new requirement for Android 13)
- Buttons can now be displayed as row

- Added dependencies:
  - @js-joda/core ^5.3.0,
  - @react-native-async-storage/async-storage ^1.17.9,
  - @react-native-community/art ^1.2.0,
  - @react-native-community/datetimepicker ^6.3.1,
  - @react-native-community/push-notification-ios ^1.11.0,
  - i18next ^22.0.2,
  - react-i18next ^12.0.0,
  - jshashes ^1.0.8,
  - react-native-permissions ^3.10.0,
  - react-native-push-notification: github:bl00dymarie/react-native-push-notification,
  - react-native-simple-toast ^1.1.3,
  - react-native-size-matters ^0.4.0,

### Fixed

- Password: Disable setting empty passwords
- After updating the password the app will do a full restart
- Chart: Grid for symptoms
- Chart: Horizontal lines in temperature chart

### Unreleased

- Partially implemented translations with react-i18next

## v1.2208.11 iOS

### Adds

- first iOS Release

### Unreleased

- Temperature scale slider
- Warning message for out of scope temperature values

## v1.2102.28 Android

### Changes

- Temperature range is now between 35 - 39°C and its default values are now set to 35.5 - 37.5°C

### Fixed

- Blocks invalid input of temperature value
- Error message for incorrect password on login screen
- Phase text on home screen for last fertile day
- Styling improvements

## v1.2101.9 Android

### Adds

- Introduces complete redesign of all sections of the app
- Adds new font
- Adds Lisa as condriputor
- Adds updated text about credits.
- Adds missing notification icon
- Adds padding between keyboard and text input
- Adds limit line length on text of symptom box

### Changes

- Updates createVersion tag for production releases
- Better wording for prediction text
- Changes the icon
- Changes font color of marked calendar days
- Updates styling of Stats page
- Updates settings menu styling
- Increases hitSlop of menu icon and navigation arrows
- Sets calendar pastScrollRange to 10 years
- Introduces RN Alert component styling update
- Introduces PasswordPrompt component redesign
- Updates button activity definition when entering new password
- Forbids landscape orientation for app
- Updates README.md
- Updates sdk 28 -> 29 and migrate to androidx

### Fixed

- Fixed drip typo
- Fixed the date label on chart from breaking
- Fixed chart dots and lines
- Fixed error on highes/lowest scale values
- Fixed extra horizontal grid line on chart
- Fixed error occurring when navigating back from settings section
- Fixed redirect to TemperatureEditView from reminder
- Fixed ordinal number suffix on chart date labels
- Fixed bug when .8 and .3 labels are not shown in chart
- Fixed react-native-vector-icon
- Fixed AppLoadingView component centering

## v0.2007-12.beta Android

### Adds

- Allows chart not to show temperature part, when temperature is not tracked and corresponding refactoring
- Detox support for e2e testing and addition of the e2e tests
- Introduces Redux global state (date and navigation are stored locally now)
- Introduces clear.sh script to the project automising clearing project caches and packages reinstallation

### Changes

- Updates of chart shades for bleeding
- Eslint rule cleanup and addition of new rules (checks for PropTypes definition for React components, multi spaces)
- sympto library upgrade to version 2.2.0
- Preparation for support of drip on iOS devices
- Updates representation of the incomplete mucus and cervix values on chart
- React Native update to 0.59.10
- Refactors of header, cycle day overview, temperature edit view pages
- Setting minimum SDK version to 23 to allow using drip on earlier versions of Android

### Fixed

- Fixed adding notes to the future dates
- Fixed app exiting with error when hitting back button on device
- Fixed Sex symptom showing on y axis of chart even though the contraception method was deleted
- Fixed of the clear.sh file name in package.json
- Fixed of navigation from chart to the cycle day overview
- Bug fix for maximum value of mucus not showing on chart
- Fixed delete button bug on symptom edit page
- Fixed of home screen centering

### Security

- Updates of node.js to fix security issue

## v0.2005.3-beta Android

- Adds arm64-v8a and x86_64 for supporting 64-bit architecture
- Adds Mariya & Sofiya as contributors &lt;3
- Fixed the error on app exiting on via the device back button
- Updates README.md
- Allows to enter note in the future
- Chart navigation bug fix.
- Changes clear to lowercase to make it case sensitive and executable
- fix 306 by setting other-note empty as contraception method 'other' is deactivated
- Don't show temperature chart part of chart when temp not tracked
- Bring in different shades for desire dots on chart
- Splits the rest of the tests without modifying them
- Moves out the test for getCyclesBefore method of cycle module
- Moves out the test for getPReviousCycle method of cycle module
- Lint rule react prop types addition
- Adds test and fixes getCycleByStartDate method of cycle module
- Moves out the tests for getCycleDayNumber and organises them
- Adds propTypes definition
- Gets rid of a top level prop passed down through a tree of components
- Cleanups symptom view
- Removes unnecessary prop and defines the missing propTypes
- Adds propTypes definition
- Gets rid of the redundant state on Home
- Moves out home helpers from the component
- Moves out HomeElement component
- Moves out IconText component
- Resets the date in store for today date when navigating home
- Sets initial value of date in the store
- Removes redundant state and corrects the cycle day prop
- Use new published sympto
- Fixed missing navigation state on exiting the app
- Adds e2e test device config for Nexus 5
- De-duplicate line
- Fixed navigation logic
- Adds go back functionality
- Adds navigation tree to define the hierarchy
- Moves navigation to the state
- Removes the lowercasing to the header title component
- Remove now superfluous check for bleeding symptom
- Adds remaining tests for maybeSetNewCycleStart
- Adds test for deleted bleeding value
- Extract maybeSetNewCycleStart into own module
- Set new cycle start when bleeding value excluded
- Changes the name of the main component
- Makes drip work on iOS
- Adds a handy script to clear builds/cache/etc
- Fixed bug - not showing maximum value of mucus in chart
- Moves calculations functions to helpers file
- Moves YAxis & HorizontalGrid components in a common conditional expression
- Moves auxiliary functions from day-column.js component file to helpers file
- Moves Surface element to TemperatureColumn component
- Introduces CycleDayLabel component
- Introduces TemperatureColumn component
- Introduces ChartLine component
- Formatting fix
- Introduces SymptomCell component
- Introduces HorizontalGrid component
- Moves out chart (data modelling) helpers to a separate file
- Introduces Tick & TickList components
- Introduces ChartLegend component
- Introduces SymptomIcon component
- Rafactors symptom color definition
- Introduces YAxis component
- Use updated sympto
- Fixed typo, and removes a redundant line
- Naming update: isFertile>isClosedAndHard, getSymptomColorIndex>symptomColorMethods; update of symptom index retrieval for the sake of readibility
- Naming update, change switch to object, fertility logic review
- make graph display for incomplete mucus and cervix values
- Fixed some warnings on build
- Updates the RN version to 0.59.10
- Re-add missing build script
- Updates the RN version to 0.59
- Moves metadata directory to root of project. So fdroid can find it.
- Cleans the console.log
- Adds test for data deletion
- Refactors the header
- Replaces the inheritance with composition pattern in the Symptom view
- Adds e2e symptom data input tests and necessary testIDs to the existing components
- Splits the temperature view to simplify it
- Updates README.md
- Fixed the cycle day data is not being passed to the symptom view
- Fixed the date not being set on changing cycle day, and adds a test for this case
- Starts using redux store for storing the date
- Redux initial setup
- Implements review feedback
- Splits &lt;CycleDayOverView /> to smaller components, to simplify it
- Adds e2e test setup to README
- Adding more tests
- Adds initial tests
- Introduces detox
- Moves app store metadata for here from fdroiddata repo
- Set minSdk to Marshmallow (earlier versions don't work)
- Only show timestamp when it has a value
- Refactors App wrapper component
- Fixed reopenning after back button
- Make home screen centered
- Adds release wizard
- Updates nodejs-mobile to fix security issue

## v0.1905.29-beta Android

### Changes

- Auto save functionality for all symptoms
- Adds donation section to about
- Clearer labels on cycle day overview
- Rename mucus to cervical mucus
- Set show more on homescreen to default and get rid of more/less switch
- Adds loading screen to data import
- Removes logo and adds header on the main login screen
- Nicer formatting for past bleeding prediction
- Removes permissions not required for debug or production
- Temperature screen styling update

### Fixed

- Styling
- Line width in chart
- Prediction range in drop on homescreen

## v0.1905.28-beta Android

- Displays all the text for Home Elements; Shortens margin btw Home Elements; Adds missing "visit" to text
- Adds donation section to about
- Gets rid of hidden icon in back button header
- Adds subcategories of cevix and mucus as labels
- Adds subcategory names to the selected options
- Changes fontSize of titles in SymptomBoxes;makes sure it stays in 1 line
- Fixed delete button
- Get rid of extra styling for non functional info icon
- Clean up
- Adds autosave for temperate
- Auto save whenever symptom view updates
- Fixed delete data bug
- Make uniform info icon and leave some space
- Align droplet text on homescreen
- Make info modal only as big as it needs to be
- Make sure info icon is always well pressable
- Specifying mucus as cervical mucus
- Make sure drop text is always positioned correctly
- Position icon text for droplet
- Styling for homescreen elements to breathe
- simple way to rearrange home screen
- Set show more on homescreen to default and get rid of more/less switch
- Don't render delete icon, instead of just setting it invisible
- Make isDeleteIconActive more readable
- Updates README.md
- Changes order of buttons in the import alert
- Remove formatting improvements that clutter up the diff
- Fixed cervix value display on overview
- Fixed mucus value display on overview
- Don't show delete icon just because symptom info is open
- Clean up markup
- Use own modal instead of alert for symptom info
- Gets rid of trailing spaces
- Gets rid of old info symptom screen
- \[WIP] Adds info button to body as alert for: \* mood, pain, temperature
- Adds info button to the body as alert
- Try out moving it to body
- For temperature, only show delete button when certain fields active
- Let symptom views overwrite isDeleteIconActive method
- Show or hide delete button based on entered data
- Remove unused style
- Ask before deleting entry
- Changes icon to trash can
- Replace info icon in header with delete
- Await alert result before navigating back
- Address MR change requests
- Reset inadvertently changed file
- Filter incomplete mucus values in sympto adapter
- Don't crash on missing temperature value
- Make header back arrow function for auto save
- Remove action button footer from symptom views
- When nothing entered, delete entry
- Adds symptom view component with back button listener
- Remove save button from footer
- Remove unused line
- Make saving incomplete value possible
- Filter out incomplete cervix value days in sympto adapter
- Updates sympto
- Adds migration making mucus and cervix values optional
- Don't compute nfp mucus value when data missing
- Adds test for missing mucus vaues
- excludes internet and system alert window from default permission
- Adds comment for bleeding prediction ranges
- Changes if statement with conditional operator
- changes action buttons color to teal, rounded corners for buttons in settings
- Fixed line width in chart
- makes the action button footer more like buttons
- Adds getTime function for bleedingPredictions reuse; minor style formatting
- Renames function to say what it 'does'
- Rename to predictedBleeding
- Nicer formatting for past bleeding prediction
- Fixed prediction range in drop on homescreen

## v0.1905.10-beta Android

- Filter release commits from changelog
- Adds update-changelog script
- Remove square brackets from CHANGELOG. They are parsed as links
- Adds commit-release and npm scripts
- Adds update version script from manyverse
- Updates RN to 58
- Remove superfluous try/catch
- Rename methods
- Adds loading screen to data import
- Improves readability of app page rendering
- Updates README.md
- adds maxLength to temperature input field
- Removes logo and adds header on the main login screen
- Adjust version name
- Don't build for x86
- Upgrade nodejs-mobile-rn to latest
- Remove unneeded maven repo and upgrade gradle to 4.10
- Lowercase values for sex, pain and mood
- Removes permissions not required for debug or production
- Adds proptypes to DeletePassword, ChangePassword and ConfirmWithPassword components
- Delete password button bug fix
- temperature screen styling update

## v0.0.3 - 2019-04-17 Android

### Changes

- Removes Google services from notification library and use fork of react-native-push-notification: <https://github.com/github:jfr3000/react-native-push-notification>

### Fixed

- Button functionality in settings for password

## v0.0.2 - 2019-04-09 Android

## Second updated beta release version Android

### Changes

- First day of the week in calendar is now Monday instead of Sunday
- Minor styling consistency

### Fixed

- Typos
- Bleeding value is visible in shortcut from Homescreen
- Delete button for sex, pain and mood
- Dates on chart

## v0.0.1 - 2019-02-15 Android

## First beta release version Android

### Added (list of core functionality)

- you can track your menstrual bleeding
- you can track symptoms related to natural family planning (nfp), i.e. basal temperature and mucus or cervix
- you can use nfp symptoms for fertility awareness (drip implements the sympto-thermal method)
- you can track other symptoms like desire, sex, pain, mood, or save a note
- you can see bleeding days and predicted bleeding days in a calendar
- drip gives you an overview of tracked symptoms on a beautiful chart
- you can see basic stats about your cycle lengths
- you can encrypt your data and protect it with a password
- you can import and export your data in a nice format (csv)
- you can set reminders (daily reminder for taking your temperature or once per cycle for your next period
