const path = require('path')
const fs = require('fs')
const glob = require('glob')

let files = []

console.log('input-chara-extra')
files = glob.sync('input-chara-extra/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ch[0-9]+)/g)[0]
  fs.copyFileSync(filePath, 'output-chara/' + name + '.png')
})

console.log('input-chara-new')
files = glob.sync('input-chara-new/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ch[0-9]+)/g)[0]
  fs.copyFileSync(filePath, 'output-chara/' + name + '.png')
})

console.log('input-chara')
files = glob.sync('input-chara/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ch[0-9]+)/g)[0]
  fs.copyFileSync(filePath, 'output-chara/' + name + '.png')
})

console.log('input-event')
files = glob.sync('input-event/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ev[0-9]+)/g)[0]
  fs.copyFileSync(filePath, 'output-event/' + name + '.png')
})

console.log('input-event-new')
files = glob.sync('input-event-new/*')
files.forEach(filePath => {
  let name = path.basename(filePath).match(/(ev[0-9]+)/g)[0]
  fs.copyFileSync(filePath, 'output-event/' + name + '.png')
})