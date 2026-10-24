const readline = require('readline')
const updateVersion = require('./update-version')
const updatePlistVersion = require('./update-plist-version')
const createTagForRelease = require('./tag-release')
const makeCommitRelease = require('./commit-release')

process.on('unhandledRejection', (err) => {
  throw err
})

async function leadThroughRelease() {
  console.log(`
🦋🪸🌼 Yay, a release! Let's do this. 
First, the version number ➕ will be updated everywhere and a new git tag 🏷️ will be created...
  `)

  await updateVersion()
  await updatePlistVersion()
  await createTagForRelease()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  await makeCommitRelease()

  console.log(`
🩸🪻🏵️ Super cool: We've created a COMMIT for this release that includes the app version number, as well as a 🏷️  git tag 💕 for the release.
Please review it, make any necessary changes, and if it's all good, push the commit and the tag up to 'your-branch' by running:
➡️  git push origin 'your-branch'
➡️  git push origin ${require('../package.json').version}

📝 Don't forget to also 
run 'pnpm build-android-aab-release' to package the aab for Google Play and
run 'pnpm build-android-apk-release' to package the apk and upload it to dripapp.org!
  `)

  process.exit(0)
}

leadThroughRelease()
