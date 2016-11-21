const fs = require('fs')
const path = require('path')
const workshopsFolder = path.join(__dirname, '..', 'workshops')

class Workshops {
  constructor () {
    this.workshops = []
  }
  raise (err) {
    console.error(err)
  }
  findWorkshops () {
    let list = fs.readdirSync(workshopsFolder)
    list.forEach(file => {
      let info = this.readWorkshop(path.join(workshopsFolder, file))
      if (info !== null) this.workshops.push(info)
    })
  }
  readWorkshop (dir) {
    try {
      let json = require(path.join(dir, 'package.json'))
      let info = {
        name: json['name'],
        title: json['pretty-name']
      }
      return info
    } catch (e) {
      this.raise(e)
      return null
    }
  }
  getWorkshops () {
    return this.workshops
  }
}

var w = new Workshops()
w.findWorkshops()
