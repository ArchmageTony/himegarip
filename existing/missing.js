const path = require('path')
const fs = require('fs')
const glob = require('glob')

let files = []

const existing = require('./existing.json').existing

let missing = {
  chara: [],
  event: [],
}


console.log('------- CHARA ------- ')
files = glob.sync('base-chara/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ch_[0-9]+)(xxx)?/g)[0]
  if (name.indexOf('xxx') === -1) {
    name = 'ch' + name.split('_')[1]
    if (existing.indexOf(name) === -1) {
      missing.chara.push(name)
    }
  }
})

console.log('------- EVENT ------- ')
files = glob.sync('base-event/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ch_[0-9]+)(xxx)?/g)[0]
  if (name.indexOf('xxx') === -1) {
    name = 'ev' + name.split('_')[1]
    if (existing.indexOf(name) === -1) {
      missing.event.push(name)
    }
  }
})

missing.chara.sort((a, b) => {
  return a.length > b.length ? 1 : ( a < b ? -1 : (a > b ? 1 : 0) )
})

missing.event.sort((a, b) => {
  return a.length > b.length ? 1 : ( a < b ? -1 : (a > b ? 1 : 0) )
})

fs.writeFileSync('missing.json', JSON.stringify(missing, null, 2))