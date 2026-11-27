const { exec } = require('child_process')

module.exports = () => {
  return new Promise((resolve, reject) => {
    const version = require('../package.json').version
    exec('git add -A', (err) => {
      if (err) return reject(err.message)
      exec(`git commit -m "release: ${version}"`, (err) => {
        if (err) return reject(err.message)
        resolve()
      })
    })
  })
}
