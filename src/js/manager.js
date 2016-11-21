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
        title: json['pretty-name'],
        dir: dir,
        exercises: []
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

var w = new Workshops()
w.findWorkshops()
