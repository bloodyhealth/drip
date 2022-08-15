// from https://gitlab.com/staltz/manyverse/blob/master/tools/update-version.js

/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const ReactNativeVersion = require('react-native-version')
const readline = require('readline')
const path = require('path')
const fs = require('fs')

module.exports = () => {
  return new Promise((resolve, reject) => {
    const currentVersion = JSON.parse(fs.readFileSync('./package.json')).version

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    function createTodaysVersion(attempt) {
      const today = new Date()
      const yy = today.getFullYear() - 2000 // So it's two digits
      const monthString = (today.getMonth() + 1).toString()
      const mm = monthString.padStart(2, '0')
      const d = today.getDate()
      if (attempt === 0) {
        return `1.${yy}${mm}.${d}`
      } else {
        const letter = String.fromCharCode(96 + attempt) // 0=a, 1=b, 2=c, ...
        return `1.${yy}${mm}.${d}.${letter}`
      }
    }

    let nextVersion
    for (let i = 0 /* letter a */; i <= 25 /* letter z */; i++) {
      nextVersion = createTodaysVersion(i)
      if (nextVersion !== currentVersion) break
    }
    if (nextVersion === currentVersion) {
      console.error('I dont know what else to generate beyond ' + nextVersion)
      process.exit(1)
    }

    rl.question(
      'Next version will be `' + nextVersion + '`, okay? y/n ',
      async (yn) => {
        if (yn !== 'y' && yn !== 'Y') {
          reject('Release cancelled.\n')
          return
        }

        const pkgJSON = JSON.parse(fs.readFileSync('./package.json'))
        const pkgLockJSON = JSON.parse(fs.readFileSync('./package-lock.json'))
        pkgJSON.version = nextVersion
        pkgLockJSON.version = nextVersion
        fs.writeFileSync('./package.json', JSON.stringify(pkgJSON, null, 2))
        fs.writeFileSync(
          './package-lock.json',
          JSON.stringify(pkgLockJSON, null, 2)
        )

        await ReactNativeVersion.version(
          {
            neverAmend: true,
            target: 'android',
          },
          path.resolve(__dirname, '../')
        )
        rl.close()
        resolve()
      }
    )
  })
}
