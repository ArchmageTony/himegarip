const path = require('path')
const fs = require('fs')
const glob = require('glob')
const UAP = require('unitiyfs-asset-parser')

const glossary = require('../extension/data.json')
const existing = require('./existing.json')

// Known Glossary
// let knownIds = { chara:[], event:[]}
// Object.keys(glossary.hashes).forEach(hash => {
//   let charaId = glossary.hashes[hash]
//   if (charaId.indexOf('ev') > -1) {
//     knownIds.event.push(charaId.match(/\d+/)[0])
//   } else if (charaId.indexOf('st') > -1) {
//     knownIds.chara.push(charaId.match(/\d+/)[0])
//   }
// })

let files = glob.sync('ab-source/*.decomp')
files.forEach(filePath => {
  // Parse File
  let hash = path.basename(filePath).split('.')[0]
  let input = fs.readFileSync(filePath)
  let assetList = UAP.parseAssetBundle(input)

  // Get AB name
  let abType = null
  let abName = null
  let assetNames = []
  assetList.forEach(asset => {
    assetNames.push(asset.m_Name)
    if (asset.type != 'Texture2D') return

    if (asset.m_Name.indexOf('ev') === 0) {
      // EVENT
      abType = 'event'
      abName = asset.m_Name.split('_')[0]

    } else if (asset.m_Name.indexOf('sss') === asset.m_Name.length -3) {
      // CHARA: SSS
      abType = 'chara'
      abName = asset.m_Name
      
    } else if (asset.m_Name.indexOf('aaa') === asset.m_Name.length -3) {
      // CHARA: AAA
      abType = 'chara'
      abName = asset.m_Name
    } else {
      // Other valids
      if (asset.m_Name.indexOf('ga') === 0) {
        abType = 'gacha'
      } else if (asset.m_Name.indexOf('aab') === asset.m_Name.length -3) {
        abType = 'adv'
      } else if (asset.m_Name.indexOf('aae') === asset.m_Name.length -3) {
        abType = 'adv'
      } else if (asset.m_Name.indexOf('aaz') === asset.m_Name.length -3) {
        abType = 'adv'
      }
      
    }
  })

  // Add to glossary
  if (!glossary.hashes[hash]) glossary.hashes[hash] = abName

  // Copy using AB name
  if (abType) {
    if (abType == 'event' || abType == 'chara') {
      let charId =  abName.match(/\d+/)[0]
      // Copy only if not existing in old gallery
      if (existing[abType].indexOf(charId) === -1) {
        // console.log('SAVING', filePath, abName)
        fs.copyFileSync(filePath, './ab-named/' + abType + '/' + abName)
      }
    } else {
      console.log('SKIP', filePath, JSON.stringify(assetNames))
    }

  } else {
    // console.log('!!!!!!!!! UNKNOWN', filePath, JSON.stringify(assetNames))
  }
})
