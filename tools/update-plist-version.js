const plist = require('plist')
const path = require('path')
const fs = require('fs')

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      const version = require('../package.json').version
      const plistPath = path.resolve(__dirname, '../ios/drip/Info.plist')
      const plistContent = fs.readFileSync(plistPath, 'utf8')
      const plistObj = plist.parse(plistContent)

      plistObj.CFBundleShortVersionString = version

      const updatedPlist = plist.build(plistObj)
      fs.writeFileSync(plistPath, updatedPlist)

      console.log(`Updated Info.plist: Version=${version}`)
      resolve()
    } catch (error) {
      console.error('Error updating Info.plist:', error)
      reject(error)
    }
  })
}
