const path = require('path')
const fs = require('fs')
const glob = require('glob')
const UAP = require('unitiyfs-asset-parser')

const glossary = require('../extension/data.json')
const existing = require('./existing.json')

// Decompressed files
let files = glob.sync('input/*.decomp')
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
        abName = asset.m_Name
      } else if (asset.m_Name.indexOf('aab') === asset.m_Name.length -3) {
        abType = 'adv'
        abName = asset.m_Name.substring(0, asset.m_Name.length-3) + 'adv'
      } else if (asset.m_Name.indexOf('aae') === asset.m_Name.length -3) {
        abType = 'adv'
        abName = asset.m_Name.substring(0, asset.m_Name.length-3) + 'adv'
      } else if (asset.m_Name.indexOf('aaz') === asset.m_Name.length -3) {
        abType = 'adv'
        abName = asset.m_Name.substring(0, asset.m_Name.length-3) + 'adv'
      }
      
    }
  })

  // Copy using AB name
  if (abType) {
    // Add to glossary
    if (glossary.hashes[hash]) {
      // Duplicate of an already known asset
      fs.renameSync(filePath, path.join(__dirname, 'output', 'duplicate', abName))

    } else {
      glossary.hashes[hash] = abName

      // Move files
      if (abType == 'event' || abType == 'chara') {
        let charId =  abName.match(/\d+/)[0]
        
        if (existing[abType].indexOf(charId) === -1) {
          console.log('SAVING', filePath, abName)
          fs.renameSync(filePath, path.join(__dirname, 'output', abType, abName))
          
        } else {
          console.log('EXISTING', filePath, abName)
          fs.renameSync(filePath, path.join(__dirname, 'output', 'existing', abName))
        }

      } else {
        console.log('SKIP', filePath, JSON.stringify(assetNames))
        fs.renameSync(filePath, path.join(__dirname, 'output', 'skip', abName))
      }
    }

  } else {
    // Add to glossary ignore
    console.log('IGNORE', filePath, JSON.stringify(assetNames))
    glossary.ignore.push(hash)
    fs.renameSync(filePath, path.join(__dirname, 'output', 'ignore', hash))
  }

})

fs.writeFileSync(path.join(__dirname, '..', 'extension', 'data.json'), JSON.stringify(glossary, null, 2))