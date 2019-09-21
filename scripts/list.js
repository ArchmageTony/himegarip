const path = require('path')
const fs = require('fs')
const glob = require('glob')

const data = require('../extension/data.json')

const existing = data.existing
const recognized = Object.values(data.hashes)

const blankIconPath = path.resolve(path.join(__dirname, '..', 'assets', 'none.png'))

let files = []

glob.sync('assets/missing-chara/*.png').forEach(file => { fs.unlinkSync(file) })
glob.sync('assets/missing-event/*.png').forEach(file => { fs.unlinkSync(file) })

glob.sync('assets/icon-chara/*.png').forEach(iconPath => {
  let iconName = path.basename(iconPath)
  let charId = iconName.match(/\d+/g)[0]
  let destIcon = path.resolve(path.join(__dirname, '..', 'assets', 'missing-chara', charId + '.png'))
  if (existing.indexOf('ch' + charId) > -1) {
    // Eixsting
    fs.copyFileSync(iconPath, destIcon)
  } else if (recognized.indexOf('ch' + charId + 'aaa') > -1 && recognized.indexOf('ch' + charId + 'sss') > -1) {
    // Complete
    fs.copyFileSync(iconPath, destIcon)
  } else {
    // Missing
    fs.copyFileSync(blankIconPath, destIcon)
  }
})

glob.sync('assets/icon-event/*.png').forEach(iconPath => {
  let iconName = path.basename(iconPath)
  let charId = iconName.match(/\d+/g)[0]
  let destIcon = path.resolve(path.join(__dirname, '..', 'assets', 'missing-event', charId + '.png'))
  if (existing.indexOf('ev' + charId) > -1) {
    // Eixsting
    fs.copyFileSync(iconPath, destIcon)
  } else if (recognized.indexOf('ev' + charId) > -1) {
    // Complete
    fs.copyFileSync(iconPath, destIcon)
  } else {
    // Missing
    fs.copyFileSync(blankIconPath, destIcon)
  }
})

