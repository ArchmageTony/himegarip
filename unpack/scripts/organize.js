const fs = require('fs')
const path = require('path')
const existing = require('../existing.json')
const data = require('../../extension/data.json')

const useNew = true
const source = useNew ? 'ab' : 'ab-rehashed'

let files = fs.readdirSync(path.join('assets', source))

files.forEach(hash => {
  let srcFile = path.join(__dirname, '..', 'assets', source, hash)
  let name = data.hashes[hash]
  if (name) {
    let charId = name.substring(0, 3)
    if (name.indexOf('ev') > -1) {
      // Event
      if (existing.events.indexOf(charId) === -1) {
        // console.log('event', hash, name)
        fs.copyFileSync(srcFile, path.join(__dirname, '..', 'assets', 'event', charId))
      }

    } else if (name.indexOf('st') > -1) {
      // Stand
      if (existing.chara.indexOf(charId) === -1) {
        // console.log('stand', hash, name)
        fs.copyFileSync(srcFile, path.join(__dirname, '..', 'assets', 'stand', charId + 'sss'))
      }
    } else if (name.indexOf('aaa') > -1) {
      // aaa
      if (existing.chara.indexOf(charId) === -1) {
        // console.log('aaa', hash, name)
        fs.copyFileSync(srcFile, path.join(__dirname, '..', 'assets', 'stand', charId + 'aaa'))
      }
    } else if (name.indexOf('adv') > -1) {
      // aab/adv
    } else if (name.indexOf('ga') > -1) {
      // gacha
    } else {
      console.log('revisit', charId)
    }
  } else {
    if (data.ignore.indexOf(hash) > -1) {
      fs.unlinkSync(srcFile)
      console.log('DELETED', hash)
    } else {
      console.log('unknown', hash)
    }
  }
})
