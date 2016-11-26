var controllers = angular.module('tailerControllers', [])
controllers.controller('EditorController', ['$scope', function ($scope) {
  $scope.workshops = manager.getWorkshops()
  $scope.exercises = []
  $scope.selected_workshop = 0
  $scope.selected_exercise = 0
  $scope.selectWorkshop = _ => {
    $scope.exercises = []
    console.log($scope.selected_workshop)
    if ($scope.selected_workshop === '-1') {
      return
    }
    $scope.exercises = manager.getExercises($scope.workshops[$scope.selected_workshop])
  }
  $scope.selectExercise = _ => {
    let exercise = $scope.exercises[$scope.selected_exercise]
    let data = manager.getExercise(exercise)
    editor.setModel(monaco.editor.createModel(data, 'javascript'))
    let desc = manager.getExerciseInfo(exercise)
    document.getElementById('exercise_readme').innerHTML = marked(desc)
  }
  $scope.openDownloader = _ => {
    document.location.href = '#/downloader'
  }
  $scope.openSettings = _ => {
    document.location.href = '#/settings'
  }
}])

controllers.controller('DownloaderController', ['$scope', function ($scope) {
  $scope.openEditor = _ => {
    document.location.href = '#/editor'
  }
  $scope.download_list = []
  document.querySelector('.loader').style.display = 'block'
  manager.getAvailableWorkshops((list) => {
    $scope.$apply(_ => {
      $scope.download_list = list['workshops']
      document.querySelector('.loader').style.display = 'none'
    })
  })
  $scope.showInfo = (name) => {
    document.querySelector('.loader').style.display = 'block'
    manager.getWorkshopReadme($scope.download_list[name], (data) => {
      document.querySelector('.dialog').style.display = 'block'
      document.querySelector('.loader').style.display = 'none'
      document.getElementById('workshop_intro').innerHTML = marked(data)
    })
  }
  $scope.closeDialog = _ => {
    document.querySelector('.dialog').style.display = 'none'
  }
  $scope.downloadWorkshop = (w) => {
    manager.downloadWorkshop(w)
  }
}])

controllers.controller('SettingsController', ['$scope', function ($scope) {
  $scope.openEditor = _ => {
    document.location.href = '#/editor'
  }
}])
