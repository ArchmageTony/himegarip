const path = require('path')
const fs = require('fs')
const glob = require('glob')
const UAP = require('unitiyfs-asset-parser')

const data = require('../extension/data.json')

// Decompressed files
let files = glob.sync('assets/ab-new/*.decomp')
files.forEach(decompFile => {
  // Parse File
  let hash = path.basename(decompFile).split('.')[0]
  let input = fs.readFileSync(decompFile)
  let assetList = UAP.parseAssetBundle(input)
  let originalFile = decompFile.substring(0, decompFile.length - 7)

  // Get asset info
  let abType = null
  let abName = null
  let hasImage = false
  assetList.forEach(asset => {
    if (abName) return
    if (asset.type != 'Texture2D') return
    hasImage = true

    if (asset.m_Name.indexOf('ev') === 0) {
      // Event
      abType = 'event'
      abName = asset.m_Name.split('_')[0]
    } else {
      let isCha = asset.m_Name.indexOf('ch') === 0
      let isSSS = asset.m_Name.indexOf('sss') === asset.m_Name.length -3
      let isAAA = asset.m_Name.indexOf('aaa') === asset.m_Name.length -3
      if (isCha && (isSSS || isAAA)) {
        // Chara
        abType = 'chara'
        abName = asset.m_Name
      } else {
        // Unknown
        abName = asset.m_Name
      }
    }
  })

  // No image inside, just delete the file
  if (!hasImage) {
    fs.unlinkSync(decompFile)
    fs.unlinkSync(originalFile)
    console.log('No image. Delete', decompFile)
  }

  // Hash already exists in our own records, ignore and delete
  if (data.hashes[hash]) {
    fs.unlinkSync(decompFile)
    fs.unlinkSync(originalFile)
    console.log('Already-recorded asset. Delete', decompFile)
    return
  }

  // No AB type, add to ignores
  if (!abType) {
    if (data.ignore.indexOf(hash) === -1) data.ignore.push(hash)
    fs.renameSync(decompFile, path.join(__dirname, '..', 'assets', 'ab-ignore', abName || hash))
    console.log('Not useful asset. Ignore', decompFile)
    return
  }

  // Existing in old gallery, ignore and delete
  if (data.existing.indexOf(abName.match(/((ch|ev)[0-9]+)/g)[0]) > -1) {
    fs.unlinkSync(decompFile)
    fs.unlinkSync(originalFile)
    console.log('Exists in old gallery. Delete', decompFile)
    return
  }

  if (Object.values(data.hashes).indexOf(abName) > -1) console.log('Duplicate', abName)
  
  data.hashes[hash] = abName
  fs.renameSync(decompFile, path.join(__dirname, '..', 'assets', 'ab-' + abType, abName))

})

fs.writeFileSync(path.join(__dirname, '..', 'extension', 'data.json'), JSON.stringify(data, null, 2))