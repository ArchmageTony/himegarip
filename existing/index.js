const path = require('path')
const fs = require('fs')
const glob = require('glob')

let files = []

const existing = require('./existing.json').existing


console.log('------- CHARA ------- ')
fs.copyFileSync('./base-chara/icon_ch_000xxx.png', './output-chara/ch001.png')
files = glob.sync('base-chara/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ch_[0-9]+)(xxx)?/g)[0]
  let charNum = name.match(/\d+/g)[0]
  if (name.indexOf('xxx') === -1) {
    name = 'ch' + name.split('_')[1]

    if (existing.indexOf(name) > -1) {
      // Existing
      fs.copyFileSync('./base-chara/icon_ch_' + charNum + '.png', './output-chara/' + name + '.png')

    } else {
      // Missing
      let chFiles1 = glob.sync('./input-chara-new/' + name + '*.png')
      let chFiles2 = glob.sync('./input-chara-extra/' + name + '*.png')
      if (chFiles1.length == 6 || chFiles2.length == 6) {
        // Has Fill
        fs.copyFileSync('./base-chara/icon_ch_' + charNum + '.png', './output-chara/' + name + '.png')

      } else {
        // Nothing
        fs.copyFileSync('./base-chara/icon_ch_000xxx.png', './output-chara/' + name + '.png')
      }

    }
  }
})

console.log('------- EVENT ------- ')
files = glob.sync('base-event/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ch_[0-9]+)(xxx)?/g)[0]
  let charNum = name.match(/\d+/g)[0]
  if (name.indexOf('xxx') === -1) {
    name = 'ev' + name.split('_')[1]

    if (existing.indexOf(name) > -1) {
      // Existing
      fs.copyFileSync('./base-event/icon_ch_' + charNum + '.png', './output-event/' + name + '.png')

    } else {
      // Missing
      let chFiles1 = glob.sync('./input-event-new/' + name + '*.png')
      if (chFiles1.length) {
        // Has Fill
        fs.copyFileSync('./base-event/icon_ch_' + charNum + '.png', './output-event/' + name + '.png')

      } else {
        // Nothing
        fs.copyFileSync('./base-chara/icon_ch_000xxx.png', './output-event/' + name + '.png')
      }

    }
  }
})

// console.log('------- EVENT ------- ')
// files = glob.sync('base-event/*')
// files.forEach(filePath => {
//   let name = path.basename(filePath).match(/(ch_[0-9]+)(xxx)?/g)[0]
//   if (name.indexOf('xxx') === -1) {
//     name = 'ev' + name.split('_')[1]
//     if (existing.indexOf(name) === -1) {
//       missing.event.push(name)
//     }
//   }
// })
