const fs = require('fs')
const path = require('path')
const glob = require('glob')
const md5File = require('md5-file')

const data = require('../../extension/data.json')

let newHashes = {}

let files1 = glob.sync('assets/ab-named/*')
files1.forEach(filePath => {
  let hash = md5File.sync(filePath)
  console.log(filePath, hash);
  if (!data.hashes[hash]) newHashes[hash] = filePath.split('/').pop()
  fs.copyFileSync(filePath, path.join(__dirname, '..', 'assets', 'ab-rehashed', hash))
})

// let files2 = glob.sync('assets/ab-special/**/*')
// files2.forEach(filePath => {
//   if (!fs.lstatSync(filePath).isDirectory()) {
//     let hash = md5File.sync(filePath)
//     console.log(filePath, hash);
//     if (!data.hashes[hash]) newHashes[hash] = filePath.split('/').pop()
//     fs.copyFileSync(filePath, path.join(__dirname, '..', 'assets', 'ab-rehashed-2', hash))
//   }
// })


fs.writeFileSync(path.join(__dirname, '..', 'assets', 'hashes.json'), JSON.stringify(newHashes, null, 2))