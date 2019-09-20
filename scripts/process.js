const path = require('path')
const fs = require('fs')
const glob = require('glob')
const UAP = require('unitiyfs-asset-parser')

const data = require('../extension/data.json')

const REGEX_EVENT = /(ev[0-9]{3,4})/g
const REGEX_CHARA = /(ch[0-9]{3,4}[a-z]{3})/g
const REGEX_STAND = /(ch[0-9]{3,4}(aaa|sss))/g
const REGEX_GACHA = /(ga[0-9]{3,4})/g

// Decompressed files
let files = glob.sync('assets/ab-new/*.decomp')
files.forEach(decompFile => {
  // Parse File
  let hash = path.basename(decompFile).split('.')[0]
  let input = fs.readFileSync(decompFile)
  let assetList = UAP.parseAssetBundle(input)
  let originalFile = decompFile.substring(0, decompFile.length - 7)

  // Hash already exists in our own records, ignore and delete
  if (data.ignore[hash] || data.hashes[hash]) {
    fs.unlinkSync(decompFile)
    fs.unlinkSync(originalFile)
    console.log('Already-recorded asset. Delete', decompFile)
    return
  }

  // Get asset info
  let abName = null
  let hasImage = false
  assetList.forEach(asset => {
    if (asset.type != 'Texture2D') return
    hasImage = true
    if ( asset.m_Name.match(REGEX_EVENT) ) abName = asset.m_Name.match(REGEX_EVENT)[0]
    else if ( asset.m_Name.match(REGEX_STAND) ) abName = asset.m_Name.match(REGEX_STAND)[0]
    else if ( asset.m_Name.match(REGEX_CHARA) && (!abName || !abName.match(REGEX_STAND)) ) abName = asset.m_Name.match(REGEX_CHARA)[0]
    else if ( asset.m_Name.match(REGEX_GACHA) ) abName = asset.m_Name.match(REGEX_GACHA)[0]
  })

  // No image inside, add to ignores and delete decomp file
  if (!hasImage) {
    data.ignore[hash] = 'NON_IMAGE'
    fs.unlinkSync(decompFile)
    console.log('No image. Ignore', abName, decompFile)
    return
  }

  // No abName, add to ignores and delete decomp file
  if (!abName) {
    data.ignore[hash] = 'NON_USEFUL'
    fs.unlinkSync(decompFile)
    console.log('Not useful asset. Ignore', abName, decompFile)
    return
  }

  // Existing in old gallery, ignore and delete
  let charId = abName.match(/((ev|ch)[0-9]{3,4})/g)
  if (charId && data.existing.indexOf(charId[0]) > -1) {
    data.ignore[hash] = 'EXISTING_OLD: ' + abName
    fs.unlinkSync(decompFile)
    fs.unlinkSync(originalFile)
    console.log('Exists in old gallery. Ignore and Delete original', abName, decompFile)
    return
  }

  // Distribute AB to their folders
  if (abName.match(REGEX_EVENT)) {
    // Event
    data.hashes[hash] = abName
    fs.renameSync(decompFile, path.join(__dirname, '..', 'assets', 'ab-event', abName))
    console.log('EVENT', abName)
    

  } else if (abName.match(REGEX_STAND)) {
    // Chara Stand
    data.hashes[hash] = abName
    
    // Check if set is complete (both aaa and sss are present)
    let matchId = abName.indexOf('sss') > 1 ? charId + 'aaa' : charId + 'sss' 
    let matchFile = path.join(__dirname, '..', 'assets', 'ab-chara', 'orphan', matchId)
    if (fs.existsSync(matchFile)) {
      console.log('CHARA-COMPLETE', abName)
      fs.renameSync(decompFile, path.join(__dirname, '..', 'assets', 'ab-chara', abName))
      fs.renameSync(matchFile, path.join(__dirname, '..', 'assets', 'ab-chara', matchId))
    } else {
      console.log('CHARA-ORPHAN', abName)
      fs.renameSync(decompFile, path.join(__dirname, '..', 'assets', 'ab-chara', 'orphan', abName))
    }
    

  } else {
    // Other: gacha assets, adv assets
    data.ignore[hash] = 'SECONDARY: ' + abName
    fs.renameSync(decompFile, path.join(__dirname, '..', 'assets', 'ab-ignore', abName))
    console.log('Secondary asset. Ignore', abName)
  }

})

// Save data
fs.writeFileSync(path.join(__dirname, '..', 'extension', 'data.json'), JSON.stringify(data, null, 2))