const fs = require('fs')
const path = require('path')
const request = require('request')
const workshopsFolder = path.join(__dirname, '..', 'workshops')
const https = require('https')
const tar = require('tar-fs')

const raise = (err) => {
  console.error(err)
}

class Workshops {
  constructor () {
    this.workshops = []
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
        title: json['pretty-name'],
        dir: dir,
        exercises: []
      }
      return info
    } catch (e) {
      raise(e)
      return null
    }
  }
  getWorkshops () {
    return this.workshops
  }
  getWorkshop (name) {
    let _w = null
    this.workshops.forEach(w => {
      if (name === w['name']) {
        _w = w
      }
    })
    return _w
  }
  getExercises (workshop) {
    if (workshop['exercises'].length > 0) {
      return workshop['exercises']
    }
    let exercisesPath = path.join(workshop.dir, 'exercises')
    let list = fs.readdirSync(exercisesPath)
    let exercises = []
    list.forEach(file => {
      let info = {
        name: file,
        exercise_dir: path.join(exercisesPath, file, `${file}.js`),
        description_dir: path.join(exercisesPath, file, 'README.md')
      }
      exercises.push(info)
    })
    workshop['exercises'] = exercises
    return exercises
  }
  getExercise (exercise) {
    return fs.readFileSync(exercise['exercise_dir'], 'utf-8')
  }
  getExerciseInfo (exercise) {
    return fs.readFileSync(exercise['description_dir'], 'utf-8')
  }
}

class Downloader {
  constructor () {
    this.download_list = []
  }
  getAvailableWorkshops (cb) {
    if (this.download_list.length > 0) {
      cb(this.download_list)
      return
    }
    request('https://raw.githubusercontent.com/vrunoa/tailer.app-workshops/master/docs/workshops.json', (err, res, body) => {
      if (err) {
        raise(err)
        return
      }
      this.download_list = JSON.parse(body)
      cb(this.download_list)
    })
  }
  getWorkshopReadme (workshop, cb) {
    let githubUrl = workshop['github_url'].replace('https://github.com/', '')
    githubUrl = ['https://raw.githubusercontent.com', githubUrl, 'master', 'README.md'].join('/')
    request(githubUrl, (err, res, body) => {
      if (err) {
        raise(err)
        return
      }
      cb(body)
    })
  }
  getTagURL (workshop) {
    return [
      workshop['github_url'].replace('https://', 'https://codeload.'),
      'tar.gz',
      `${workshop.tag_release}`
    ].join('/')
  }
  createTmp (w, workshop) {
    let date = (new Date()).getTime()
    return path.join(
      __dirname, '..', 'tmp',
      `${w}-${date}-${workshop.tag_release}.tar.gz`
    )
  }
  getWorkshopFolder (w) {
    return path.join(
      __dirname, '..', 'workshops', w
    )
  }
  downloadWorkshop (w, cb) {
    let workshop = this.download_list['workshops'][w]
    if (workshop === null) {
      cb(null, new Error(`Error trying to get workshop ${w}`))
      return
    }
    let tagURL = this.getTagURL(workshop)
    let tmpPath = this.createTmp(w, workshop)
    let workshopFolder = this.getWorkshopFolder(w)
    console.log(workshopFolder)
    let file = fs.createWriteStream(tmpPath)
    let download = (tagURL, tmpPath, _cb_) => {
      https.get(tagURL, (response) => {
        response.pipe(file)
        untar(tmpPath, _cb_)
      })
    }
    let untar = (tmpPath, _cb_) => {
      console.log(tmpPath)
      fs.createReadStream(tmpPath).pipe(tar.extract(workshopFolder))
    }
    download(tagURL, tmpPath)
  }
}

var manager = new Workshops()
manager.findWorkshops()
var downloader = new Downloader()
console.log(downloader)
