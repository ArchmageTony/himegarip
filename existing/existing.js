const path = require('path')
const fs = require('fs')
const glob = require('glob')

let files = []

let result = {
  existing: []
}

console.log('input-chara')
files = glob.sync('input-chara/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ch[0-9]+)/g)[0]
  if (result.existing.indexOf(name) === -1) result.existing.push(name)
})

console.log('input-event')
files = glob.sync('input-event/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ev[0-9]+)/g)[0]
  if (result.existing.indexOf(name) === -1) result.existing.push(name)
})

fs.writeFileSync('existing.json', JSON.stringify(result, null, 2))