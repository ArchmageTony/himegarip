const path = require('path')
const fs = require('fs')
const glob = require('glob')

const missing = require('./missing.json');

missing.chara.forEach(name => {
  let chFiles1 = glob.sync('./input-chara-new/' + name + '*.png')
  let chFiles2 = glob.sync('./input-chara-extra/' + name + '*.png')
  // let formStates = [false,false,false,false,false,false,]
  // Check new files
  if (chFiles1.length == 6) {
    // chFiles1.forEach(filePath => {
    //   fs.copyFileSync(filePath, './output-chara/' + path.basename(filePath))
    // })
  } else {
    // if (chFiles1.length > 1) console.log('fragment1', name)
    // Check extra files
    if (chFiles2.length == 6) {
      chFiles2.forEach(filePath => {
        fs.copyFileSync(filePath, './output-chara/' + path.basename(filePath))
      })
    } else {
      if (chFiles1.length > 1) console.log('fragmented1', name)
      if (chFiles2.length > 1) console.log('fragmented2', name)
      let charNum = name.match(/\d+/g)[0]
      // fs.copyFileSync('./base-chara/icon_ch_' + charNum + '.png', './output-chara/' + name + 'aaa.png')
      // fs.copyFileSync('./base-chara/icon_ch_' + charNum + '.png', './output-chara/' + name + 'bab.png')
      // fs.copyFileSync('./base-chara/icon_ch_' + charNum + '.png', './output-chara/' + name + 'cac.png')
      // fs.copyFileSync('./base-chara/icon_ch_' + charNum + '.png', './output-chara/' + name + 'dad.png')
      // fs.copyFileSync('./base-chara/icon_ch_' + charNum + '.png', './output-chara/' + name + 'eae.png')
      // fs.copyFileSync('./base-chara/icon_ch_' + charNum + '.png', './output-chara/' + name + 'sss.png')
    }
  }
})

// missing.event.forEach(name => {
//   let chFiles = glob.sync('./input-event-new/' + name + '*.png')
//   if (chFiles.length) {
//     chFiles.forEach(filePath => {
//       fs.copyFileSync(filePath, './output-event/' + path.basename(filePath))
//     })
//   } else {
//     let charNum = name.match(/\d+/g)[0]
//     // fs.copyFileSync('./base-event/icon_ch_' + charNum + '.png', './output-event/' + name + '_01_aaa.png')
//     // fs.copyFileSync('./base-event/icon_ch_' + charNum + '.png', './output-event/' + name + '_01_bab.png')
//     // fs.copyFileSync('./base-event/icon_ch_' + charNum + '.png', './output-event/' + name + '_01_cac.png')
//   }
// })
