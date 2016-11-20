const fs = require('fs')
const path = require('path')
const workshopsFolder = path.join(__dirname, '..', 'workshops')
let workshops = []
fs.stat(workshopsFolder, (err, stats) => {
  if (err) {
    console.log(err)
    return
  }
  fs.readdir(workshopsFolder, (err, files) => {
    if (err) {
      console.log(err)
      return
    }
    files.forEach(file => {
      workshops.push(file)
    })
  })
})
